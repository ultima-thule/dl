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

class TimeSpentData (object):
    def __init__(self):
        self.sumStoryPoints = 0.0
        self.sumTimeSpent = 0.0
        self.tableTasks = {}
glTsd = TimeSpentData()


def getIssueField(issue, name, defValue):
    return issue["fields"].get(name) or defValue


def sprintInfoToHTML(sprintName, sprintStart, sprintEnd):
    doc, tag, text, line = Doc().ttl()

    with tag('div'):
        with tag('table', border='1', klass='confluenceTable'):
            with tag('tbody'):
                with tag('tr'):
                    line('th', 'Kod sprintu')
                    line('th', sprintName)
                    line('th', sprintStart)
                    line('th', sprintEnd)
    return doc.getvalue()


def sprintCostsToHTML():
    global glTsd
    doc, tag, text, line = Doc().ttl()

    line('h1', 'Koszt sprintu', id=projectname + '-Kosztsprintu')

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
                    with tag('td', ('style', 'text-align: center')): text(glTsd.sumStoryPoints)
                    with tag('td', ('style', 'text-align: center')): text('-')
                with tag('tr'):
                    with tag('td'):
                        line('strong', 'Wartość rzeczywista po review')
                    line('td', glTsd.sumStoryPoints, ('style', 'text-align: center'))
                    line('td', glTsd.sumTimeSpent, ('style', 'text-align: center'))
    return doc.getvalue()


def sprintPlanToHTML (jiraIssues):
    global glTsd

    doc, tag, text, line = Doc().ttl()

    line('h1', 'Elementy zadeklarowane do realizacji', id=projectname + '-Elementyzadeklarowanedorealizacji')

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


def sprintExternalToHTML ():
    doc, tag, text, line = Doc().ttl()

    line('h1', 'Elementy zgłoszone do zewnętrznego zespołu', id=projectname + '-Elementyzgloszonedozewnetrznegozespolu')

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


def sprintNotDoneToHTML ():
    doc, tag, text, line = Doc().ttl()

    line('h1', 'Elementy niezrealizowane w sprincie', id=projectname + '-Elementyniezrealizowanewsprincie')

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


def sprintExtraDoneToHTML ():
    doc, tag, text, line = Doc().ttl()

    line('h1', 'Elementy dodatkowe, nieplanowane', id=projectname + '-Elementydodatkowe%2Cnieplanowane')

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


def countRealReportedTime (jiraHours):
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
                        if wl["started"] > dateFrom \
                        and wl["started"] <= dateTo]
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
    projectname = sys.argv[1]
    sprint = sys.argv[2]
    if len(sys.argv) > 3:
        username = sys.argv[3]
        password = getpass.getpass()
    else:
        pass

    #TODO: change on console
    username = credentials.loginJira['consumer_secret']
    password = credentials.loginJira['password']

    #init Jira connection
    jira = lib.jira.Jira(username, password)

    # Get the $sprint_number from the given $project
    searchTxtIssues = "http://jira.grupa.onet/rest/api/2/search?jql=project = '" + projectname + "' AND Type != Sub-task AND sprint = " + sprint \
                  + "&fields=status,issuetype,summary,customfield_11726,customfield_10002,aggregatetimespent"
    searchTxtSprintData = "http://jira.grupa.onet/rest/agile/1.0/sprint/" + sprint

    #Sprint general data
    jiraSprintData = jira.search(searchTxtSprintData)
    sprintName = jiraSprintData["name"]
    dateFrom = parser.parse(jiraSprintData["startDate"]).strftime('%Y-%m-%d')
    dateTo = parser.parse(jiraSprintData["endDate"]).strftime('%Y-%m-%d')

    #real reported hours
    searchTxtHours = "http://jira.grupa.onet/rest/api/2/search?jql=project='" + projectname + "' \
                        AND worklogDate>%s AND worklogDate<%s&fields=summary,customfield_11726,customfield_10002,worklog,parent"\
                        %(dateFrom, dateTo)
    #searchTxtHours = "http://jira.grupa.onet/rest/api/2/search?jql=project='" + projectname + "' \
                        #AND id IN (ZUMISEARCH-59, ZUMISEARCH-60, ZUMISEARCH-61,ZUMISEARCH-62)&fields=worklog,aggregatetimespent,parent"

    #Sprint planning
    jiraHours = jira.search(searchTxtHours, 'issues')

    countRealReportedTime(jiraHours)

    jiraIssues = jira.search(searchTxtIssues, 'issues')

    #build HTML page
    doc, tag, text = Doc().tagtext()

    doc.asis(sprintInfoToHTML(sprintName, dateFrom, dateTo))    #First table - sprint data
    planHTML = sprintPlanToHTML(jiraIssues)
    doc.asis(sprintCostsToHTML())    #Second table - sprint costs
    doc.asis(planHTML)    #Third table - story list
    doc.asis(sprintExternalToHTML())    #Fourth table - items for external team
    doc.asis(sprintNotDoneToHTML())    #Fifth table - items not done in sprint
    doc.asis(sprintExtraDoneToHTML())    #Sixth table - extra items in sprint

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

        parentPageTitle = projectname
        childPageTitle = "Sprint " + sprint + " | " + projectname

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

