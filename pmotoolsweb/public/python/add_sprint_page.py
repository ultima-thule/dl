#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys, string, xmlrpc, re, getpass, requests, json
import xmlrpc.client
from datetime import datetime
from dateutil import parser
import credentials

def getOrCreateCfPage(cfServer, userToken, spaceKey, title, parentID, content):
    pageId = None

    try:
        pageId = cfServer.confluence2.getPage(userToken, spaceKey, title)
    except:
        if createCfPage(cfServer, userToken, spaceKey, title, parentID, content):
            pageId = cfServer.confluence2.getPage(userToken, spaceKey, title)

    return pageId


def createCfPage(cfServer, userToken, spaceKey, title, parentID, content):
    try:
        page = {
                "space": spaceKey,
                "parentId": parentID,
                "title": title,
                "content": content
                }
        cfServer.confluence2.storePage(userToken, page)
    except:
        return False

    return True

if __name__ == '__main__':
    dev = 0

    usernameJira = credentials.loginJira['consumer_secret']
    passwordJira = credentials.loginJira['password']

    #============CONST============
    url = "http://doc.grupa.onet/rpc/xmlrpc"

    oprintname = "openSprints()"

    if len(sys.argv) < 3:
        exit("Usage: " + sys.argv[0] + " projectname sprintAlias")

    # test variables
    projectname = sys.argv[1]
    sprint = sys.argv[2]

    jira_search = "http://jira.grupa.onet/rest/api/2/search?jql=project = '" + projectname + "' AND Type = Story \
            AND Sprint in openSprints()&fields=summary,customfield_11726,customfield_10002 "

    jira_sprint = "http://jira.grupa.onet/rest/agile/1.0/sprint/" + sprint

    # JIRA SPRINT PART
    out = requests.get(jira_sprint, auth=(usernameJira, passwordJira))
    jira_sprint_data = json.loads(out.content.decode())
    dateFrom = parser.parse(jira_sprint_data["startDate"])
    dateTo = parser.parse(jira_sprint_data["endDate"])

    # JIRA SEARCH PART
    out = requests.get(jira_search, auth=(usernameJira, passwordJira))
    jira_issues_tmp = out.content.decode().replace("'", "\"")
    jira_issues = json.loads(jira_issues_tmp).get('issues')

    #####################################################################################################################
    sum_story = 0
    items_table = ""
    for issue in jira_issues:
        KA = issue["fields"].get("customfield_11726") and issue["fields"].get("customfield_11726") or "n/a"
        SP = issue["fields"].get("customfield_10002", "0") and str(issue["fields"].get("customfield_10002", "0")) or "0"
        SUB = issue["fields"].get("summary")
        items_table += """
                <tr>
                    <td class="confluenceTd"><p>%s</p></td>
                    <td colspan="1" class="confluenceTd">%s</td>
                    <td style="text-align: center;" class="confluenceTd">%s</td>
                    <td style="text-align: center;" class="confluenceTd">-</td>
                    <td style="text-align: center;" colspan="1" class="confluenceTd"><span style="color: rgb(112,112,112);">Tak</span></td>
                </tr>
        """ % (SUB, KA, SP)
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

                <td colspan="1" class="confluenceTd"><strong>Wartosc estymowana na planningu</strong></td>

                <td style="text-align: center;" class="confluenceTd">%f</td>

                <td style="text-align: center;" class="confluenceTd">-</td>
            </tr>
            <tr>

                <td colspan="1" class="confluenceTd"><strong>Wartosc rzeczywista po review</strong></td>

                <td colspan="1" style="text-align: center;" class="confluenceTd">-</td>

                <td colspan="1" style="text-align: center;" class="confluenceTd">-</td>
            </tr>
        </tbody>
    </table>
    </div>
    """.replace("%f", str(sum_story))

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

    <span style="color: rgb(0,0,0);"> </span></p><h1 id="Sprint1%7CPL_DL_IT_CMS_P2.WIDGTS_L-Elementydodatkowe%2Cnieplanowane"><span style="color: rgb(0,0,0);">Elementy dodatkowe, nie planowane</span></h1><p></p>

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

        server = xmlrpc.client.ServerProxy(url)
        token = server.confluence2.login(usernameCF, passwordCF)

        spacekey = "AG"
        parentPageTitle = projectname
        childPageTitle = projectname + " | " + sprint

        parentID = getOrCreateCfPage(server, token, spacekey, parentPageTitle, "64070870", "")

        if parentID is not None:
            if not createCfPage(server, token, spacekey, childPageTitle, parentID.get("id"), input_html):
                exit(1)

        exit(0)

