
import argparse
import datetime
import operator
import sys
import credentials
from mongoengine import *
import lib.mongoLeankit
import lib.jira
import lib.excel_estimate

def _initMongoConn ():
    connect('leankit')

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
    if len(sys.argv) < 2:
        exit("Usage: " + sys.argv[0] + " projectname")
    project_name = sys.argv[1]

    _initMongoConn()

    #init Jira connection
    user_jira = credentials.loginJira['consumer_secret']
    pwd_jira = credentials.loginJira['password']
    jira = lib.jira.Jira('http://jira.grupa.onet', user_jira, pwd_jira)

    date_text = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    file_name = "./pw_files/" + project_name + "_kosztorys.xlsx"

    excelReport = lib.excel_estimate.ExcelEstimate(file_name, "Kosztorys", False)

    issues = jira.get_all_issues(project_name)
    data = {
        "issues": build_issues_tree(issues),
        "projectName": project_name,
        "show_subtasks": False
    }

    excelReport.init_report(data)
    excelReport.generate_report()
    excelReport.close()

    #document.save("./pw_files/%s.docx" % project_name)

    #pwfile = lib.mongoLeankit.Pwfile()

    #pwfile.data = data
    #pwfile.project = project_name
    #pwfile.generation_date = datetime.datetime.now()
    #pwfile.date_text = date_text
    #pwfile.format_type = "XLSX"
    #pwfile.save()

    exit(0)
