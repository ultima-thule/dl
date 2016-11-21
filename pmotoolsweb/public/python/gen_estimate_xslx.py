import datetime
import sys

import credentials
import lib.jira


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


def build_issues_tree(data):
    """ Builds logical tree of issues: parent -> subtasks """
    response = {}
    for elem in data:
        parent_id = get_parent_id(elem)
        issue = {
            "key": elem["key"],
            "parent": parent_id,
            "summary": elem["fields"]["summary"],
            "type": elem["fields"]["issuetype"]["name"],
            "epic": elem["fields"]["customfield_11300"],
            "sprints": get_sprints(elem),
            "timespent": get_time_spent(elem, "timespent"),
            "totaltimespent": get_time_spent(elem, "aggregatetimespent"),
            "children": []
        }

        parent_issue = {
            "key": parent_id, "parent": None,
            "summary": "", "type": None,
            "epic": None, "sprints": {},
            "timespent": 0, "totaltimespent": 0,
            "children": []
        }

        #it's a subtasks
        if parent_id is not None:
            if not parent_id in response:
                response[parent_id] = parent_issue
            response[parent_id]["children"].append(issue)
        #it's not a subtask
        else:
            if issue["key"] in response:
                issue["children"] = response[issue["key"]]["children"]
            response[issue["key"]] = issue

    return response

if __name__ == '__main__':
    if len(sys.argv) < 2:
        exit("Usage: " + sys.argv[0] + " projectname")
    project_name = sys.argv[1]

    #init Jira connection
    user_jira = credentials.loginJira['consumer_secret']
    pwd_jira = credentials.loginJira['password']
    jira = lib.jira.Jira('http://jira.grupa.onet', user_jira, pwd_jira)

    excelReport = lib.excel_estimate.ExcelEstimate(project_name + "_kosztorys_"
                    + datetime.datetime.now().strftime("%Y%m%d-%H%M%S.xlsx"), "Kosztorys")

    issues = jira.get_all_issues(project_name)
    data = {
        "issues": build_issues_tree(issues),
        "projectName": project_name
    }

    excelReport.init_report(data)
    excelReport.write_task_list(True)
    excelReport.close()

    exit(0)
