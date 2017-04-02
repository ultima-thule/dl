import datetime
import json

import credentials
import lib.excel_estimate
from mongoengine import *


def _initMongoConn ():
    connect('leankit')


class JiraInitiative(object):
    def __init__(self, key_id):
        self.key = key_id
        self.summary = ""
        self.description = ""
        self.pm = None
        self.status = None
        self.inititative_status = ""
        self.risk_status = ""
        self.risk_description = ""
        self.BO = None
        self.owned_by_team = None
        self.project_code = ""
        self.project_card = ""
        self.contract_status = None
        self.planned_cost = 0
        self.cost_LBE = 0
        self.current_cost = 0
        self.started_on = None
        self.planned_release_on = None
        self.release_LBE_on = None
        self.finish_on = None
        self.product_owner = None
        self.program_manager = None
        self.program_link = None
        self.last_updated_status_date = None
        self.record_date = datetime.datetime.now().strftime("%Y%m%d")


def check_and_get(elem, key, value_type, def_value):
    if elem is not None and key in elem["fields"]:
        if value_type is None:
            return elem["fields"][key]
        if elem["fields"][key] is not None:
            if value_type is "value":
                return elem["fields"][key]["value"]
            if value_type is "person":
                return elem["fields"][key]["displayName"]
            if value_type is "name":
                return elem["fields"][key]["name"]
            if value_type is "parent_child":
                return elem["fields"][key]["value"] + " - " + elem["fields"][key]["child"]["value"]
    return def_value


def parse_initiatives(data):
    """ Builds logical structure of issues, eliminate not needed data"""
    response = []
    for elem in data:
        issue = JiraInitiative(elem["key"])

        issue.summary = check_and_get(elem, "summary", None, "")
        issue.description = check_and_get(elem, "description", None, "")
        issue.pm = check_and_get(elem, "assignee", "person", None)
        issue.status = check_and_get(elem, "status", "name", None)
        issue.inititative_status = check_and_get(elem, "customfield_12237", None, "")
        issue.risk_status = check_and_get(elem, "customfield_12227", "value", "")
        issue.risk_description = check_and_get(elem, "customfield_12240", None, "")
        issue.BO = check_and_get(elem, "customfield_12231", "value", "")
        issue.owned_by_team = check_and_get(elem, "customfield_12239", "parent_child", None)
        issue.project_code = check_and_get(elem, "customfield_12243", None, "")
        issue.project_card = check_and_get(elem, "customfield_12226", None, "")
        issue.contract_status = check_and_get(elem, "customfield_12230", "value", "")
        issue.planned_cost = check_and_get(elem, "customfield_12222", None, 0)
        issue.cost_LBE = check_and_get(elem, "customfield_12223", None, 0)
        issue.current_cost = check_and_get(elem, "customfield_12238", None, 0)
        issue.started_on = check_and_get(elem, "customfield_12232", None, None)
        issue.planned_release_on = check_and_get(elem, "customfield_12234", None, None)
        issue.release_LBE_on = check_and_get(elem, "customfield_12233", None, None)
        issue.finish_on = check_and_get(elem, "customfield_12228", None, None)
        issue.product_owner = check_and_get(elem, "customfield_12244", "person", None)
        issue.program_manager = check_and_get(elem, "customfield_12235", "person", None)
        issue.program_link = check_and_get(elem, "epicLink", None, None)

        parse_changelog(elem, issue)

        response.append(issue)

    return response


def parse_changelog(elem, issue):
    last_date = None
    last_status = None

    if elem is not None and issue is not None:
        if elem["changelog"] is not None and elem["changelog"]["histories"] is not None:
            for hist in elem["changelog"]["histories"]:
                if "items" in hist and hist["items"] is not None:
                    for item in hist["items"]:
                        if item["field"] == "Initiative status":
                            last_date = hist["created"][0:10]

    issue.last_updated_status_date = last_date


def dumper(obj):
    try:
        return obj.toJSON()
    except:
        return obj.__dict__

if __name__ == '__main__':
    project_name = "PORTFOLIO"

    _initMongoConn()

    #init Jira connection
    user_jira = credentials.loginJira['consumer_secret']
    pwd_jira = credentials.loginJira['password']
    jira = lib.jira.Jira('http://jira.grupa.onet', user_jira, pwd_jira)

    date_text = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    file_name = project_name + date_text + ".json"

    issues = jira.get_all_initiatives(project_name)

    json_issues = parse_initiatives(issues)

    json_data = json.dumps(json_issues, default=dumper, indent=4)

    pwfile = lib.mongoLeankit.Textfile()

    pwfile.data = json_data
    pwfile.project = project_name
    pwfile.generation_date = datetime.datetime.now()
    pwfile.date_text = date_text
    pwfile.format_type = "JSON"
    pwfile.save()

    exit(0)
