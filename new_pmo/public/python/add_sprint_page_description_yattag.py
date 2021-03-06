#!/usr/bin/python
# -*- coding: utf-8 -*-

import getpass
import sys

import credentials
import lib.confluence
import lib.jira
from yattag import Doc

gl_tsd = lib.jira.JiraTimeSpent()


def get_issue_field(issue, name, def_value):
    """ Returns the value of field or default value. """
    return issue["fields"].get(name) or def_value


def sprint_info_to_html(sprint):
    """ Generates HTML page fragment, containing basic sprint information."""
    doc, tag, text, line = Doc().ttl()

    with tag('div'):
        with tag('table', border='1', klass='confluenceTable'):
            with tag('tbody'):
                with tag('tr'):
                    line('th', 'Kod sprintu')
                    line('th', sprint.name)
                    line('th', sprint.date_from)
                    line('th', sprint.date_to)
    return doc.getvalue()


def sprint_costs_to_html(project_name, cost_table):
    """ Generates HTML page fragment, containing summary info of sprint costs. """

    doc, tag, text, line = Doc().ttl()

    line('h1', 'Koszt sprintu', id=project_name + '-Kosztsprintu')

    with tag('div', klass='table-wrap'):
        with tag('table', border='1', klass='confluenceTable'):
            with tag('tbody'):
                with tag('tr'):
                    line('th', '')
                    line('th', 'Suma SP na sprint')
                    line('th', 'Czas realizacji')
                with tag('tr'):
                    with tag('td'):
                        line('strong', 'Wartość estymowana na planningu')
                    with tag('td', ('style', 'text-align: center')): text(cost_table.sum_story_points)
                    with tag('td', ('style', 'text-align: center')): text('-')
                with tag('tr'):
                    with tag('td'):
                        line('strong', 'Wartość rzeczywista po review')
                    line('td', cost_table.sum_story_points, ('style', 'text-align: center'))
                    line('td', cost_table.sum_time_spent, ('style', 'text-align: center'))
    return doc.getvalue()


def sprint_plan_to_html(project_name, jiraIssues):
    """ Generates HTML page fragment, containing detailed information on stories and tasks taken to sprint."""
    global gl_tsd

    doc, tag, text, line = Doc().ttl()

    line('h1', 'Elementy zadeklarowane do realizacji', id=project_name + '-Elementyzadeklarowanedorealizacji')

    with tag('div', klass='table-wrap'):
        with tag('table', border='1', klass='confluenceTable'):
            with tag('thead'):
                with tag('tr'):
                    line('th', 'Temat zadania')
                    line('th', 'Kryteria akceptacji')
                    line('th', 'Story Pointy')
                    line('th', 'Czas realizacji')
                    line('th', 'Czy zrealizowane?')
            with tag('tbody'):
                status_map = {'ToDo': 'Nie', 'In Progress': 'Nie', 'Waiting': 'Nie', 'Resolved': 'Tak', 'Closed': 'Tak', 'Reopened': 'Nie',
                               'code review': 'Nie', 'Backlog': 'Nie', 'Done': 'Tak', 'Blocked': 'Nie'}
                for issue in jiraIssues:
                    issue_summary = get_issue_field(issue, 'summary', '')
                    issue_acc_crit = get_issue_field(issue, 'description', 'n/a')
                    issue_sp = get_issue_field(issue, 'customfield_10002', '0')
                    #issue_time_spent = get_issue_field(issue, 'aggregatetimespent', '0')
                    # DO ODBLOKOWANIA AGREGATETIMESPENT
                    issue_time_spent = float(gl_tsd.table_tasks.get(issue["key"], 0.0))
                    issue_status = 'Nie'
                    stat_from_issue = get_issue_field(issue, 'status', None)["name"]
                    if stat_from_issue in status_map:
                        issue_status = status_map[stat_from_issue]

                    with tag('tr', klass='confluenceTr'):
                        line('td', issue_summary)
                        line('td', issue_acc_crit)
                        line('td', issue_sp, ('style', 'text-align: center'))
                        line('td', issue_time_spent, ('style', 'text-align: center'))
                        line('td', issue_status, ('style', 'text-align: center'))
                    gl_tsd.sum_story_points += float(issue_sp)

    return doc.getvalue()


def sprint_external_to_html(project_name):
    """ Generates HTML page fragment, containing detailed information on stories and tasks planned in external teams."""
    doc, tag, text, line = Doc().ttl()

    line('h1', 'Elementy zgłoszone do zewnętrznego zespołu', id=project_name + '-Elementyzgloszonedozewnetrznegozespolu')

    with tag('div', klass='table-wrap'):
        with tag('table', border='1', klass='confluenceTable'):
            with tag('thead'):
                with tag('tr'):
                    line('th', 'Temat zadania')
                    line('th', 'Kryteria akceptacji')
                    line('th', 'Zespół wspierajacy')
                    line('th', 'Czas realizacji')
            with tag('tbody'):
                with tag('tr'):
                    line('td', '')
                    line('td', '')
                    line('td', '')
                    line('td', '')

    return doc.getvalue()


def sprint_not_done_to_html(project_name):
    """ Generates HTML page fragment, containing detailed information on stories and tasks not done in sprint."""
    doc, tag, text, line = Doc().ttl()

    line('h1', 'Elementy niezrealizowane w sprincie', id=project_name + '-Elementyniezrealizowanewsprincie')

    with tag('div', klass='table-wrap'):
        with tag('table', border='1', klass='confluenceTable'):
            with tag('thead'):
                with tag('tr'):
                    line('th', 'Temat zadania')
                    line('th', 'Uwagi/Jaka część zadania pozostała do realizacji')
            with tag('tbody'):
                with tag('tr'):
                    line('td', '')
                    line('td', '')

    return doc.getvalue()


def sprint_extra_done_to_html (project_name):
    """ Generates HTML page fragment, containing detailed information on stories and tasks added to sprint after planning."""

    doc, tag, text, line = Doc().ttl()

    line('h1', 'Elementy dodatkowe, nieplanowane', id=project_name + '-Elementydodatkowe%2Cnieplanowane')

    with tag('div', klass='table-wrap'):
        with tag('table', border='1', klass='confluenceTable'):
            with tag('thead'):
                with tag('tr'):
                    line('th', 'Temat zadania')
                    line('th', 'Kryteria akceptacji')
                    line('th', 'Story point')
                    line('th', 'Czas realizacji')
            with tag('tbody'):
                with tag('tr'):
                    line('td', '')
                    line('td', '')
                    line('td', '')
                    line('td', '')

    return doc.getvalue()


def count_real_reported_time (jira_hours, sprint):
    """ Sums worklogs in given time period."""

    global gl_tsd
    # let's write down all reported hours per task
    struct = {}
    for issue in jira_hours:
        # where to find the main story id
        if 'parent' in issue['fields'].keys():
            # get the parent key, where append hours from the subtasks:
            ky = issue['fields']['parent']['key']
        else:
            # get the STORY id
            ky = issue['key']
        # Get array with reported time between the timeline
        arr = [[wl['author']['displayName'], wl['timeSpentSeconds'], wl['updated'][:10]] for wl in
                issue['fields']['worklog']['worklogs'] \
                        if wl["started"] > sprint.date_from \
                        and wl["started"] <= sprint.date_to]
        if ky in struct.keys():
            struct[ky] += arr
        else:
            struct.update({ky: arr})
    # dictionary contains sum of reported hours per task:
    # struct = {'ZUMISEARCH-59': [['Różański Tomasz', 3600, '2016-11-15'], ['Różański Tomasz', 3600, '2016-11-15'], ['Różański
    # Tomasz', 3600, '2016-11-15'], ['Różański Tomasz', 7200, '2016-11-15']]}
    per_task = {}
    for (task, wls) in struct.items():
        per_task.update({task: sum([wl[1] for wl in wls])/3600.})
    #per_task = {task: sum((wl[1] for wl in wls[0]))/3600. for (task, wls) in struct.items()}
    sum_time_spent = sum(per_task.values())

    gl_tsd.sum_time_spent = sum_time_spent
    gl_tsd.table_tasks = per_task
    return


if __name__ == '__main__':
    dev = 0
    if len(sys.argv) < 3:
        exit("Usage: " + sys.argv[0] + " projectname sprint")

    #====================================================
    # If the script is running from the console this part
    # allows to catch the proper variables
    #====================================================
    project_name = sys.argv[1]
    sprint_id = sys.argv[2]
    if len(sys.argv) > 3:
        user_jira = sys.argv[3]
        pwd_jira = getpass.getpass()
    else:
        pass

    #====================================================
    # Init Jira connection
    #====================================================
    # CONSOLERUN: comment two lines:
    user_jira = credentials.loginJira['consumer_secret']
    pwd_jira = credentials.loginJira['password']
    jira = lib.jira.Jira('http://jira.grupa.onet', user_jira, pwd_jira)

    #====================================================
    # GET-DATA BLOCK
    #====================================================
    # Get the sprint general data
    sprint = jira.get_sprint_data(sprint_id)

    # Get the sprint planning data
    jira_hours = jira.get_worklogs_in_sprint(project_name, sprint)
    count_real_reported_time(jira_hours, sprint)
    jira_issues = jira.get_issues_in_sprint(project_name, sprint)


    #====================================================
    # BUILD HTML
    #====================================================
    doc, tag, text = Doc().tagtext()

    doc.asis(sprint_info_to_html(sprint))    #First table - sprint data
    planHTML = sprint_plan_to_html(project_name, jira_issues)
    doc.asis(sprint_costs_to_html(project_name, gl_tsd))    #Second table - sprint costs
    doc.asis(planHTML)    #Third table - story list
    doc.asis(sprint_external_to_html(project_name))    #Fourth table - items for external team
    doc.asis(sprint_not_done_to_html(project_name))    #Fifth table - items not done in sprint
    doc.asis(sprint_extra_done_to_html(project_name))    #Sixth table - extra items in sprint

    #====================================================
    # CONFLUENCE PART
    #====================================================
    # dev variable- if is "1" the content won't be written in the confluence
    if dev != 1:

        user_cf = credentials.loginConfluence['consumer_secret']
        pwd_cf = credentials.loginConfluence['password']

        # CONSOLERUN: uncomment on console
        #usernameCF = usernameJira
        #passwordCF = passwordJira

        url = "http://doc.grupa.onet/rpc/xmlrpc"
        confl = lib.confluence.Confluence(url, user_cf, pwd_cf, "PROJEKTY")
        # CONSOLERUN: uncomment on console
        #confl = lib.confluence.Confluence(url, usernameCF, passwordCF, "trozanski")

        parent_page_title = project_name
        child_page_title = "Sprint " + sprint_id + " | " + project_name

        parent_id = confl.get_or_create_page(parent_page_title, "64070870", "")
        # CONSOLERUN: uncomment on console- this id is related to trozanski space
        #parentID = {"id": "64072422"}

        if parent_id is not None:
            #newPage = confl.createPage(child_page_title, parentID.get("id"), doc.getvalue())
            new_page = confl.update_or_create_page(child_page_title, parent_id.get("id"), doc.getvalue())
            if new_page is None:
                print("No new page")
                exit(1)
            print(new_page.get("id"))
        exit(0)

