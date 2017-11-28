#!/usr/bin/python
# -*- coding: utf-8 -*-

import getpass
import sys
import os
import datetime

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
                line('th', 'PM/Zespół')
                line('th', 'Wykon [h]')
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
                        if risk_description != "":
                            doc.asis("<BR/><b>Ryzyko:</b>")
                            text(risk_description)  # risk status

                    with tag('td'):
                        if card["fields"]["status"]["name"] == "Cancelled" or card["fields"]["status"]["name"] == "Closed":
                            risk_name = risk_map["stopped"]
                        else:
                            risk_name = risk_map[get_issue_field_complex(card, "customfield_12227", "value", None, "other")]
                        doc.asis(risk_name) #risk status
                    with tag('td'):
                        doc.asis("<ac:link><ri:user ri:username=\"" + get_issue_field_complex(card, "assignee", "key", None, "n/a") + "\"/></ac:link> / ") #PM
                        text(get_issue_field_complex(card, "customfield_12239", "child", "value", "n/a")) #team

                    with tag('td'):
                        text(str(get_issue_field_simple(card, 'customfield_12238',"0")))

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

    date_text = datetime.datetime.now().strftime("%Y-%m-%d")
    parent_page_title = "Statusy produkcji mobile"
    child_page_title = "Status produkcji IT mobile " + date_text
    parent_id = confl.get_or_create_page(parent_page_title, "64068064", "")

    if parent_id is not None:
        #newPage = confl.createPage(child_page_title, parentID.get("id"), doc.getvalue())
        new_page = confl.update_or_create_page(child_page_title, parent_id.get("id"), doc.getvalue())
        if new_page is None:
            print("No new page")
            exit(1)
        print(new_page.get("id"))
    exit(0)

