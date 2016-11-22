import argparse
import datetime
import operator

from mongoengine import *

import credentials
import lib.mongoLeankit
import lib.jira
import lib.excel_estimate

class JiraIssue (object):
    def __init__(self, parent_id):
        self.key = parent_id
        self.parent = None
        self.summary = ""
        self.type = None
        self.epic = None
        self.sprints = {}
        self.timespent = 0
        self.totaltimespent = 0
        self.children = []
        self.not_management_task = False
        self.not_analysis_task = False
        self.rank = 0


def get_time_spent(elem, field_name):
    """ Counts timespent in hours instead of miliseconds."""
    ts = elem["fields"].get(field_name, 0)
    if ts is None:
        ts = 0
    ts /= 3600
    return ts

def get_parent_id(elem):
    """ Returns paren key or none. """
    if elem["fields"].get("parent") is not None:
        return elem["fields"]["parent"]["key"]
    return None

def get_sprints(elem):
    """ Parses sprint string info dictionary of sprint_id: name. """
    sprints = elem["fields"].get("customfield_10800")
    dict_sprints = {}
    if sprints is not None:
        for index in range(len(sprints)):
            left_index = sprints[index].find('[')
            right_index = sprints[index].find(']')
            lst_sprints = sprints[index][left_index+1:right_index].split(',')

            sprint_id = None
            sprint_name = None

            for item in lst_sprints:
                kvPair = item.split('=')
                if kvPair[0] == "id":
                    sprint_id = kvPair[1]
                elif kvPair[0] == "name":
                    sprint_name = kvPair[1]

            if sprint_id is not None:
                dict_sprints[sprint_id] = sprint_name

    return dict_sprints

def not_management_task(text):
    text = text.lower()
    if "zarządzanie projektem" in text\
            or "pm" in text\
            or "zarzadzanie projektem" in text:
        return False
    return True


def not_analysis_task(text):
    text = text.lower()
    if "scrum" in text\
            or "analityczne" in text:
        return False
    return True


def build_issues_tree(data):
    """ Builds logical tree of issues: parent -> subtasks """
    response = {}
    for elem in data:
        parent_id = get_parent_id(elem)

        issue = JiraIssue(parent_id)
        issue.key = elem["key"]
        issue.parent = None
        issue.summary = elem["fields"]["summary"]
        issue.type = elem["fields"]["issuetype"]["name"]
        issue.epic = elem["fields"]["customfield_11300"]
        issue.sprints = get_sprints(elem)
        issue.timespent = get_time_spent(elem, "timespent")
        issue.totaltimespent = get_time_spent(elem, "aggregatetimespent")
        issue.children = []
        issue.not_management_task = not_management_task(issue.summary)
        issue.not_analysis_task = not_analysis_task(issue.summary)
        issue.rank = elem["fields"]["customfield_11304"]

        parent_issue = JiraIssue(parent_id)

        #it's a subtasks
        if parent_id is not None:
            if not parent_id in response:
                response[parent_id] = parent_issue
            response[parent_id].children.append(issue)
        #it's not a subtask
        else:
            if issue.key in response:
                issue.children = response[issue.key].children
            response[issue.key] = issue

    sorted_response = sorted(response.values(), key=operator.attrgetter('not_management_task', 'not_analysis_task', 'rank'))

    return sorted_response

if __name__ == '__main__':

    # parse arguments
    parser = argparse.ArgumentParser(description='Generate xlsx estimate sheeto for project.')
    parser.add_argument('-p', '--project', help='project name', required=True)
    memory_parser = parser.add_mutually_exclusive_group(required=True)
    memory_parser.add_argument('--memory', dest='memory', action='store_true')
    memory_parser.add_argument('--no-memory', dest='memory', action='store_false')
    parser.set_defaults(memory=True)
    subtasks_parser = parser.add_mutually_exclusive_group(required=True)
    subtasks_parser.add_argument('--subtasks', dest='subtasks', action='store_true')
    subtasks_parser.add_argument('--no-subtasks', dest='subtasks', action='store_false')
    parser.set_defaults(subtasks=False)
    args = parser.parse_args()

    #init Jira connection
    user_jira = credentials.loginJira['consumer_secret']
    pwd_jira = credentials.loginJira['password']
    jira = lib.jira.Jira('http://jira.grupa.onet', user_jira, pwd_jira)

    file_name = args.project + "_kosztorys_" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S.xlsx")

    excelReport = lib.excel_estimate.ExcelEstimate(file_name, "Kosztorys", args.memory)

    issues = jira.get_all_issues(args.project)
    data = {
        "issues": build_issues_tree(issues),
        "projectName": args.project,
        "show_subtasks": args.subtasks
    }

    excelReport.init_report(data)
    excelReport.generate_report()
    data = excelReport.close()

    if args.memory:
        connect('leankit')
        report = lib.mongoLeankit.Estimate()

        report.xls_data = data
        report.generation_date = datetime.datetime.now()
        report.project_name = args.project

        report.save()

    exit(0)
