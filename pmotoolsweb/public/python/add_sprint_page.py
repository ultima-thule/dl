#!/usr/bin/python
# -*- coding: utf-8 -*-

import json
import requests
import sys

import xmlrpc.client
########################### PYTHON 3.5 modules ##################
from dateutil import parser
import credentials
#################################################################
import getpass
from datetime import datetime, timedelta

def getOrCreateCfPage(cfServer, userToken, spaceKey, title, parentID, content):
    pageId = None

    try:
        pageId = cfServer.confluence2.getPage(userToken, spaceKey, title)
    except:
        if createCfPage(cfServer, userToken, spaceKey, title, parentID, content) is not None:
            pageId = cfServer.confluence2.getPage(userToken, spaceKey, title)

    return pageId

def updtadeOrCreateCfPage(cfServer, userToken, spaceKey, title, parentID, content):
    pageId = None

    try:
        pageId = cfServer.confluence2.getPage(userToken, spaceKey, title)
    except:
        if createCfPage(cfServer, userToken, spaceKey, title, parentID, content) is not None:
            pageId = cfServer.confluence2.getPage(userToken, spaceKey, title)
            return pageId
    try:
        if createCfPage(cfServer, userToken, spaceKey, title, parentID, content, pageId) is not None:
            return pageId
    except:
        print(msg)
    return pageId


def createCfPage(cfServer, userToken, spaceKey, title, parentID, content, pageId=None):
    newPage = None
    page = {
            "space": spaceKey,
            "parentId": parentID,
            "title": title,
            "content": content,
            #"creator": "babciamalina"
            }
    if pageId is not None:
        page = {
                "id": pageId["id"],
                "space": spaceKey,
                "parentId": parentID,
                "title": title,
                "content": content,
                "version": pageId["version"],
                }
    try:
        newPage = cfServer.confluence2.storePage(userToken, page)
    except Exception as msg:
        print(msg)

    return newPage

if __name__ == '__main__':
    dev = 0 


    #============CONST============
    url = "http://doc.grupa.onet/rpc/xmlrpc"


    if len(sys.argv) < 3:
        exit("Usage: " + sys.argv[0] + " projectname sprint username")

    # variables
    projectname = sys.argv[1]
    sprint = sys.argv[2]
    if len(sys.argv) > 3:
        usernameJira = sys.argv[3]
        passwordJira = getpass.getpass()
    else:
        pass
    #TODO: change on console
    usernameJira = credentials.loginJira['consumer_secret']
    passwordJira = credentials.loginJira['password']


    # Get the $sprint_number from the given $project
    jira_search = "http://jira.grupa.onet/rest/api/2/search?jql=project = '" + projectname + "' AND Type != Sub-task AND sprint = " + sprint \
                  + "&fields=summary,customfield_11726,customfield_10002,aggregatetimespent"
    jira_sprint = "http://jira.grupa.onet/rest/agile/1.0/sprint/" + sprint

    # JIRA SPRINT PART
    out = requests.get(jira_sprint, auth=(usernameJira, passwordJira))
    jira_sprint_data = json.loads(out.content.decode())
    dateFrom = parser.parse(jira_sprint_data["startDate"])
    dateTo = parser.parse(jira_sprint_data["endDate"])
    # TODO: change on console
    #dateFrom = datetime.now() - timedelta(days=14) 
    #dateTo = datetime.now()
    #real reported hours
    jira_hours_search = "http://jira.grupa.onet/rest/api/2/search?jql=project = '" + projectname + "'  \
    AND worklogDate > %s AND worklogDate < %s&fields=summary,customfield_11726,customfield_10002,worklog"\
    %(dateFrom.strftime('%Y-%m-%d'), dateTo.strftime('%Y-%m-%d'))

    # JIRA SEARCH PART
    out = requests.get(jira_search, auth=(usernameJira, passwordJira))
    jira_issues = json.loads(out.content.decode()).get('issues')

    out_hour = requests.get(jira_hours_search, auth=(usernameJira, passwordJira))
    jira_hours = json.loads(out_hour.content.decode()).get('issues')
    struct = {issue['key'] : \
            [[wl['author']['displayName'], wl['timeSpentSeconds']] for wl in issue['fields']['worklog']['worklogs']]
            for issue in jira_hours}
    # dictionary contains sum of reported hours per task:
    pertask = {task: sum((wl[1] for wl in wls))/3600. for (task, wls) in struct.items()}
    sum_timespent = sum(pertask.values())
    #####################################################################################################################
    sum_story = 0
    items_table = ""
    for issue in jira_issues:
        #Kryteria akceptacji
        KA = issue["fields"].get("customfield_11726") and issue["fields"].get("customfield_11726") or "n/a"
        # StorPoints
        SP = issue["fields"].get("customfield_10002", "0") and str(issue["fields"].get("customfield_10002", "0")) or "0"
        #timeSpent = float( issue["fields"].get("aggregatetimespent", "0") and str(issue["fields"].get("aggregatetimespent", "0")) or "0") / 3600
        timeSpent = float(pertask.get(issue["key"], 0.0))
        SUB = issue["fields"].get("summary")
        items_table += """
                <tr>
                    <td class="confluenceTd"><p>%s</p></td>
                    <td colspan="1" class="confluenceTd">%s</td>
                    <td style="text-align: center;" class="confluenceTd">%s</td>
                    <td style="text-align: center;" class="confluenceTd">%s</td>
                    <td style="text-align: center;" colspan="1" class="confluenceTd"><span style="color:rgb(112,112,112);">Nie</span></td>
                </tr>
        """ % (SUB, KA, SP, timeSpent)
        sum_story += float(SP)
    input_html = """
    <div>
     <table border="1" class="confluenceTable">
        <tbody>
            <tr>
                <th class="confluenceTh">Kod sprintu</th>
                <th class="confluenceTh">%s</th>
                <th colspan="1" class="confluenceTh">%s</th>
                <th colspan="1" class="confluenceTh">%s</th>
            </tr>
        </tbody>
    </table>
    </div>
    """ % (jira_sprint_data["name"], dateFrom.strftime('%Y-%m-%d'), dateTo.strftime('%Y-%m-%d'))

    input_html += """
    <h1 id="Sprint1%7CPL_DL_IT_CMS_P2.WIDGTS_L-Kosztsprintu">Koszt sprintu</h1>
    <p></p><p></p><p></p>
    <div class="table-wrap">
    <table border="1" class="confluenceTable">
        <tbody>
            <tr>
                <th colspan="1" class="confluenceTh"></th>
                <th class="confluenceTh">Suma SP na sprint</th>
                <th class="confluenceTh">Czas realizacji</th>
            </tr>
            <tr>

                <td colspan="1" class="confluenceTd"><strong>Wartość estymowana na planningu</strong></td>

                <td style="text-align: center;" class="confluenceTd">%f</td>

                <td style="text-align: center;" class="confluenceTd">-</td>
            </tr>
            <tr>

                <td colspan="1" class="confluenceTd"><strong>Wartość rzeczywista po review</strong></td>

                <td colspan="1" style="text-align: center;" class="confluenceTd">%f</td>

                <td colspan="1" style="text-align: center;" class="confluenceTd">%ss</td>
            </tr>
        </tbody>
    </table>
    </div>
    """.replace("%f", str(sum_story)).replace("%ss", str(sum_timespent))

    input_html += """
    <h1 id="Sprint1%7CPL_DL_IT_CMS_P2.WIDGTS_L-Elementyzadeklarowanedorealizacji">Elementy zadeklarowane do realizacji</h1>
    <p></p>
    <div class="table-wrap">
    <table border="1" class="confluenceTable">
        <thead>
            <tr>
                <th class="confluenceTh">Temat zadania</th>
                <th colspan="1" class="confluenceTh"><span>Kryteria akceptacji</span></th>
                <th class="confluenceTh"><span title="Sort By Story Points">Story Pointy</span></th>
                <th class="highlight-red confluenceTh" data-highlight-colour="red"><span title="Sort By Time Spent">Czas realizacji</span></th>
                <th class="highlight-grey confluenceTh" colspan="1" data-highlight-colour="grey">Czy zrealizowane?</th>
            </tr>
        </thead>
            <tbody>
    """

    input_html += items_table

    input_html += """
            </tbody>
        </table>
        </div>
    <p> </p><p>
    <line-height: 1.25;">Elementy zgloszone do zewnetrznego zespolu</span>
    </p><p></p>

    <div class="table-wrap"><table border="1" class="confluenceTable">
    <thead>
        <tr>
            <th class="confluenceTh">Temat zadania</th><th colspan="1" class="confluenceTh">Kryteria akceptacji</th>
            <th class="confluenceTh"><span title="Sort By Story Points">Zespol wspierajacy</span></th>
            <th class="confluenceTh"><span title="Sort By Time Spent">Czas realizacji</span></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="confluenceTd"> </td>
            <td colspan="1" class="confluenceTd"> </td>
            <td class="confluenceTd"> </td>
            <td class="confluenceTd"> </td></tr><tr>
            <td class="highlight-grey confluenceTd" colspan="3" data-highlight-colour="grey" style="text-align: right;"><strong>Suma:</strong></td>
            <td colspan="1" class="confluenceTd"> </td></tr></tbody></table></div><h1 id="Sprint1%7CPL_DL_IT_CMS_P2.WIDGTS_L-Elementyniezrealizowanewsprincie">Elementy niezrealizowane w sprincie</h1><p></p><div class="table-wrap"><table border="1" class="confluenceTable"><tbody><tr><th class="confluenceTh">Temat zadania</th><th class="confluenceTh">Uwagi/Jaka czesc zadania pozostala do realizacji</th></tr><tr>
            <td class="confluenceTd">n/a</td>
            <td class="confluenceTd">n/a</td>
        </tr>
    </tbody>
    </table>
    </div><p>

    <span style="color: rgb(0,0,0);"> </span></p><h1 id="Sprint1%7CPL_DL_IT_CMS_P2.WIDGTS_L-Elementydodatkowe%2Cnieplanowane"><span style="color: rgb(0,0,0);">Elementy dodatkowe, nieplanowane</span></h1><p></p>

    <div class="table-wrap">
    <table border="1" class="confluenceTable">
        <tbody>
            <tr>
                <th class="confluenceTh">Temat zadania</th>
                <th class="confluenceTh">Kryteria akceptacji</th>
                <th colspan="1" class="confluenceTh">Story Point</th>
                <th class="confluenceTh">Czas realizacji</th>
            </tr>
            <tr>
                <td class="confluenceTd">n/a</td>
                <td class="confluenceTd">n/a</td>
                <td colspan="1" class="confluenceTd"> </td>
                <td style="text-align: center;" class="confluenceTd">n/a</td>
            </tr>
        </tbody>
    </table>
    </div>
    <p><span style="color: rgb(0,0,0);"> </span></p><p> </p><p><span style="color: rgb(0,0,0);"><br /></span></p>
    </div>
    """
    #####################################################################################################################

    # CONFLUENCE PART
    # dev variable- if is "1" the content won't be written in the confluence
    if dev != 1:

        usernameCF = credentials.loginConfluence['consumer_secret']
        passwordCF = credentials.loginConfluence['password']
        #TODO: change on console
        #usernameCF = usernameJira
        #passwordCF = passwordJira

        server = xmlrpc.client.ServerProxy(url)
        token = server.confluence2.login(usernameCF, passwordCF)

        #spacekey = "AG"
        spacekey = "PROJEKTY"
        #TODO
        #spacekey = "~trozanski"

        parentPageTitle = projectname
        childPageTitle = "Sprint " + sprint + " | " + projectname

        parentID = getOrCreateCfPage(server, token, spacekey, parentPageTitle, "64070870", "")
        #TODO
        #parentID = {"id": "64072422"}

        if parentID is not None:
            #newPage = createCfPage(server, token, spacekey, childPageTitle, parentID.get("id"), input_html)
            newPage = updtadeOrCreateCfPage(server, token, spacekey, childPageTitle, parentID.get("id"), input_html)
            if newPage is None:
                print("No new page")
                exit(1)
            print (newPage.get("id"))
        exit(0)

