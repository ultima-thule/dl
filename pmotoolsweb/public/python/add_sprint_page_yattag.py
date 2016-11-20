#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys

import xmlrpc.client
########################### PYTHON 3.5 modules ##################
from dateutil import parser
import credentials
#################################################################
import getpass

from yattag import Doc
import lib.confluence
import lib.jira

from datetime import datetime, timedelta
import pprint


glTsd = lib.jira.JiraTimeSpent()

def getIssueField(issue, name, defValue):
    """ Returns the value of field or default value. """
    return issue["fields"].get(name) or defValue


def sprintInfoToHTML(sprint):
    """ Generates HTML page fragment, containing basic sprint information."""
    doc, tag, text, line = Doc().ttl()

    with tag('div'):
        with tag('table', border='1', klass='confluenceTable'):
            with tag('tbody'):
                with tag('tr'):
                    line('th', 'Kod sprintu')
                    line('th', sprint.name)
                    line('th', sprint.dateFrom)
                    line('th', sprint.dateTo)
    return doc.getvalue()


def sprintCostsToHTML(projectName, costTable):
    """ Generates HTML page fragment, containing summary info of sprint costs. """

    doc, tag, text, line = Doc().ttl()

    line('h1', 'Koszt sprintu', id=projectName + '-Kosztsprintu')

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
                    with tag('td', ('style', 'text-align: center')): text(costTable.sumStoryPoints)
                    with tag('td', ('style', 'text-align: center')): text('-')
                with tag('tr'):
                    with tag('td'):
                        line('strong', 'Wartość rzeczywista po review')
                    line('td', costTable.sumStoryPoints, ('style', 'text-align: center'))
                    line('td', costTable.sumTimeSpent, ('style', 'text-align: center'))
    return doc.getvalue()


def sprintPlanToHTML (projectName, jiraIssues):
    """ Generates HTML page fragment, containing detailed information on stories and tasks taken to sprint."""
    global glTsd

    doc, tag, text, line = Doc().ttl()

    line('h1', 'Elementy zadeklarowane do realizacji', id=projectName + '-Elementyzadeklarowanedorealizacji')

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
                statusMap = { 'ToDo': 'Nie', 'In Progress': 'Nie', 'Waiting': 'Nie', 'Resolved': 'Tak', 'Closed': 'Tak', 'Reopened': 'Nie'}
                for issue in jiraIssues:
                    issueSummary = getIssueField(issue, 'summary', '')
                    issueAccCrit = getIssueField(issue, 'customfield_11726', 'n/a')
                    issueSP = getIssueField(issue, 'customfield_10002', '0')
                    #issueTimeSpent = getIssueField(issue, 'aggregatetimespent', '0')
                    # DO ODBLOKOWANIA AGREGATETIMESPENT
                    issueTimeSpent = float(glTsd.tableTasks.get(issue["key"], 0.0))
                    issueStatus = statusMap[getIssueField(issue, 'status', None)["name"]]

                    with tag('tr', klass='confluenceTr'):
                        line('td', issueSummary)
                        line('td', issueAccCrit)
                        line('td', issueSP, ('style', 'text-align: center'))
                        line('td', issueTimeSpent, ('style', 'text-align: center'))
                        line('td', issueStatus, ('style', 'text-align: center'))
                    glTsd.sumStoryPoints += float(issueSP)

    return doc.getvalue()


def sprintExternalToHTML (projectName):
    """ Generates HTML page fragment, containing detailed information on stories and tasks planned in external teams."""
    doc, tag, text, line = Doc().ttl()

    line('h1', 'Elementy zgłoszone do zewnętrznego zespołu', id=projectName + '-Elementyzgloszonedozewnetrznegozespolu')

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


def sprintNotDoneToHTML (projectName):
    """ Generates HTML page fragment, containing detailed information on stories and tasks not done in sprint."""
    doc, tag, text, line = Doc().ttl()

    line('h1', 'Elementy niezrealizowane w sprincie', id=projectName + '-Elementyniezrealizowanewsprincie')

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


def sprintExtraDoneToHTML (projectName):
    """ Generates HTML page fragment, containing detailed information on stories and tasks added to sprint after planning."""

    doc, tag, text, line = Doc().ttl()

    line('h1', 'Elementy dodatkowe, nieplanowane', id=projectName + '-Elementydodatkowe%2Cnieplanowane')

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


def countRealReportedTime (jiraHours, sprint):
    """ Sums worklogs in given time period."""

    global glTsd
    # let's write down all reported hours per task
    struct = {}
    for issue in jiraHours:
        # where to find the main story id
        if 'parent' in issue['fields'].keys():
            ky = issue['fields']['parent']['key']
        else:
            ky = issue['key']
        # Get array with reported time between the timeline
        arr = [[wl['author']['displayName'], wl['timeSpentSeconds'], wl['updated'][:10]] for wl in
                issue['fields']['worklog']['worklogs'] \
                        if wl["started"] > sprint.dateFrom \
                        and wl["started"] <= sprint.dateTo]
        if ky in struct.keys():
            struct[ky] += arr
        else:
            struct.update({ky: arr})
    # dictionary contains sum of reported hours per task:
    # {'ZUMISEARCH-59': [['Różański Tomasz', 3600, '2016-11-15'], ['Różański Tomasz', 3600, '2016-11-15'], ['Różański
    # Tomasz', 3600, '2016-11-15'], ['Różański Tomasz', 7200, '2016-11-15']]}
    perTask = {}
    for (task, wls) in struct.items():
        perTask.update({task: sum([wl[1] for wl in wls])/3600.})
    #pertask = {task: sum((wl[1] for wl in wls[0]))/3600. for (task, wls) in struct.items()}
    sumTimeSpent = sum(perTask.values())

    glTsd.sumTimeSpent = sumTimeSpent
    glTsd.tableTasks = perTask
    return


if __name__ == '__main__':
    dev = 0 

    #============CONST============
    if len(sys.argv) < 3:
        exit("Usage: " + sys.argv[0] + " projectname sprint")

    # variables
    projectName = sys.argv[1]
    sprintID = sys.argv[2]
    if len(sys.argv) > 3:
        userJira = sys.argv[3]
        pwdJira = getpass.getpass()
    else:
        pass

    #init Jira connection
    #TODO: change on console
    userJira = credentials.loginJira['consumer_secret']
    pwdJira = credentials.loginJira['password']
    jira = lib.jira.Jira('http://jira.grupa.onet', userJira, pwdJira)

    #Get sprint general data
    sprint = jira.getSprintData(sprintID)

    #Get sprint planning data
    jiraHours = jira.getWorklogsInSprint(projectName, sprint)
    countRealReportedTime(jiraHours, sprint)
    jiraIssues = jira.getIssuesInSprint(projectName, sprint)

    #Build HTML page
    doc, tag, text = Doc().tagtext()

    doc.asis(sprintInfoToHTML(sprint))    #First table - sprint data
    planHTML = sprintPlanToHTML(projectName, jiraIssues)
    doc.asis(sprintCostsToHTML(projectName, glTsd))    #Second table - sprint costs
    doc.asis(planHTML)    #Third table - story list
    doc.asis(sprintExternalToHTML(projectName))    #Fourth table - items for external team
    doc.asis(sprintNotDoneToHTML(projectName))    #Fifth table - items not done in sprint
    doc.asis(sprintExtraDoneToHTML(projectName))    #Sixth table - extra items in sprint

    #####################################################################################################################
    # CONFLUENCE PART
    # dev variable- if is "1" the content won't be written in the confluence
    if dev != 1:

        usernameCF = credentials.loginConfluence['consumer_secret']
        passwordCF = credentials.loginConfluence['password']

        #TODO: change on console
        #usernameCF = usernameJira
        #passwordCF = passwordJira

        url = "http://doc.grupa.onet/rpc/xmlrpc"
        confl = lib.confluence.Confluence(url, usernameCF, passwordCF, "PROJEKTY")
        #TODO
        #confl = lib.confluence.Confluence(url, usernameCF, passwordCF, "trozanski")

        parentPageTitle = projectName
        childPageTitle = "Sprint " + sprintID + " | " + projectName

        parentID = confl.getOrCreatePage(parentPageTitle, "64070870", "")
        #TODO
        #parentID = {"id": "64072422"}

        if parentID is not None:
            #newPage = confl.createPage(childPageTitle, parentID.get("id"), doc.getvalue())
            newPage = confl.updateOrCreatePage(childPageTitle, parentID.get("id"), doc.getvalue())
            if newPage is None:
                print("No new page")
                exit(1)
            print(newPage.get("id"))
        exit(0)

