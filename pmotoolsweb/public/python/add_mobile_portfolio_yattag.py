#!/usr/bin/python
# -*- coding: utf-8 -*-

import getpass
import sys
import os

import credentials
import lib.confluence
import lib.jira
from yattag import Doc

gl_tsd = lib.jira.JiraTimeSpent()


def get_issue_field_simple(issue, name, def_value):
    """ Returns the value of field or default value. """
    return issue["fields"].get(name) or def_value


def get_issue_field_complex(issue, name, subname, subsubname=None, def_value="n/a"):
    """ Returns the value of field or default value. """
    main_field = issue["fields"].get(name)
    if main_field:
        sub_field = main_field.get(subname)
        if not subsubname:
            return sub_field or def_value
        elif sub_field:
            return sub_field.get(subsubname) or def_value
    return def_value


def page_header():
    doc, tag, text, line = Doc().ttl()

    line('h1', 'Status produkcji mobile')
    with tag('p'):
        with tag('a', href="http://jira.grupa.onet/secure/RapidBoard.jspa?rapidView=297&amp;projectKey=PORT&amp;view=detail&amp;quickFilter=2912"):
            text("Status in Jira")

    with tag('p'):
        doc.asis("<ac:macro ac:name=\"status\"><ac:parameter ac:name=\"colour\">Red</ac:parameter>")
        doc.asis("<ac:parameter ac:name=\"title\">Wysokie ryzyko</ac:parameter></ac:macro> ")
        doc.asis("<ac:macro ac:name=\"status\"><ac:parameter ac:name=\"colour\">Yellow</ac:parameter>")
        doc.asis("<ac:parameter ac:name=\"title\">Średnie ryzyko</ac:parameter></ac:macro> ")
        doc.asis("<ac:macro ac:name=\"status\"><ac:parameter ac:name=\"colour\">Green</ac:parameter>")
        doc.asis("<ac:parameter ac:name=\"title\">W toku</ac:parameter></ac:macro> ")
        doc.asis("<ac:macro ac:name=\"status\"><ac:parameter ac:name=\"title\">inny</ac:parameter></ac:macro>")

    with tag('p'):
        doc.asis("<ac:emoticon ac:name=\"green-star\"/> nowy projekt")

    return doc.getvalue()


def program_info_to_html(portfolio):
    """ Generates HTML page fragment, containing program information."""
    doc, tag, text, line = Doc().ttl()

    last_status = ""

    status_map = {'ToDo': 'Faza: Nierozpoczęte', 'In Progress': 'Faza: W trakcie',
                  'Roadmap': 'Faza: Roadmapa', 'Cancelled': 'Faza: Anulowane', 'Closed': 'Faza: Zamknięte'}

    risk_map = {'medium risk': "<ac:macro ac:name=\"status\"><ac:parameter ac:name=\"colour\">Yellow</ac:parameter><ac:parameter ac:name=\"title\">Średnie ryzyko</ac:parameter></ac:macro> ",
                'high risk': "<ac:macro ac:name=\"status\"><ac:parameter ac:name=\"colour\">Red</ac:parameter><ac:parameter ac:name=\"title\">Wysokie ryzyko</ac:parameter></ac:macro> ",
                'on track': "<ac:macro ac:name=\"status\"><ac:parameter ac:name=\"colour\">Green</ac:parameter>""<ac:parameter ac:name=\"title\">W toku</ac:parameter></ac:macro> ",
                'other': "<ac:macro ac:name=\"status\"><ac:parameter ac:name=\"title\">inny</ac:parameter></ac:macro>",
                'stopped': "<ac:macro ac:name=\"status\"><ac:parameter ac:name=\"title\">zakończony</ac:parameter></ac:macro>"}


    with tag('table'):
        with tag('tbody'):
            with tag('tr'):
                line('th', 'Projekt')
                line('th', 'Informacja o statusie', colspan="3")
                line('th', 'PM')
                line('th', 'Zespół')
                line('th', 'Data aktualizacji')

            for card in portfolio:
                status_name = status_map[card["fields"]["status"]["name"]]
                if last_status != status_name:
                    last_status = status_name
                    with tag('tr'):
                        line('th', status_name, colspan="7", style="text-align: center;")
                with tag('tr'):
                    with tag('th'):
                        line('a', get_issue_field_simple(card, "summary", "n/a"), href="http://jira.grupa.onet/browse/" + card["key"]) #name

                    risk_description = get_issue_field_simple(card, 'customfield_12240',"")
                    with tag('td', colspan="2"):
                        text(get_issue_field_simple(card, 'customfield_12237', 'n/a')) #status
                        text("Ryzyko: " + risk_description)  # status

                    with tag('td'):
                        if card["fields"]["status"]["name"] == "Cancelled" or card["fields"]["status"]["name"] == "Closed":
                            risk_name = risk_map["stopped"]
                        else:
                            risk_name = risk_map[get_issue_field_complex(card, "customfield_12227", "value", None, "other")]
                        doc.asis(risk_name)
                    with tag('td'):
                        doc.asis("<ac:link><ri:user ri:username=\"" + get_issue_field_complex(card, "assignee", "key", None, "n/a") + "\"/></ac:link>")# PM

                    line('td', get_issue_field_complex(card, "customfield_12239", "child", "value", "n/a")) # team

                    updated = card["fields"]["updated"]
                    for item in card["changelog"]["histories"]:
                        changed_items = item["items"]
                        if changed_items:
                            for i in changed_items:
                                if i["field"] == "Initiative status":
                                    updated = item["created"]
                                    break
                    line('td', updated[0:10])  # PM
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
                        line('td', 'Wartość estymowana na planningu')
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
                    issue_acc_crit = get_issue_field(issue, 'customfield_11726', 'n/a')
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
    # os.path('/home/httpd/dl/pmotoolsweb/public/python')

    #====================================================
    # Init Jira connection
    #====================================================
    user_jira = credentials.loginJira['consumer_secret']
    pwd_jira = credentials.loginJira['password']
    jira = lib.jira.Jira('http://jira.grupa.onet', user_jira, pwd_jira)

    #====================================================
    # GET-DATA BLOCK
    #====================================================
    # Get the portfolio general data
    portfolio = jira.get_mobile_portfolio()

    #====================================================
    # BUILD HTML
    #====================================================
    doc, tag, text = Doc().tagtext()

    doc.asis(page_header())
    doc.asis(program_info_to_html(portfolio))

    # doc.asis(sprint_info_to_html(sprint))    #First table - sprint data
    # planHTML = sprint_plan_to_html(project_name, jira_issues)
    # doc.asis(sprint_costs_to_html(project_name, gl_tsd))    #Second table - sprint costs
    # doc.asis(planHTML)    #Third table - story list
    # doc.asis(sprint_external_to_html(project_name))    #Fourth table - items for external team
    # doc.asis(sprint_not_done_to_html(project_name))    #Fifth table - items not done in sprint
    # doc.asis(sprint_extra_done_to_html(project_name))    #Sixth table - extra items in sprint

    #====================================================
    # CONFLUENCE PART
    #====================================================

    print("generuje strone statusu mobile ")
    user_cf = credentials.loginConfluence['consumer_secret']
    pwd_cf = credentials.loginConfluence['password']

    # CONSOLERUN: uncomment on console

    url = "http://doc.grupa.onet/rpc/xmlrpc"
    confl = lib.confluence.Confluence(url, user_cf, pwd_cf, "PMOB")

    parent_page_title = "Statusy produkcji mobile"
    child_page_title = "Status produkcji IT mobile 2017-11-05"
    parent_id = confl.get_or_create_page(parent_page_title, "64068064", "")

    if parent_id is not None:
        #newPage = confl.createPage(child_page_title, parentID.get("id"), doc.getvalue())
        new_page = confl.update_or_create_page(child_page_title, parent_id.get("id"), doc.getvalue())
        if new_page is None:
            print("No new page")
            exit(1)
        print(new_page.get("id"))
    exit(0)

