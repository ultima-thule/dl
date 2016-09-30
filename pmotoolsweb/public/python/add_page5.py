#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys, string, xmlrpclib, re, getpass, requests, json
dev = 0

#============CONST============
url = "http://doc.grupa.onet/rpc/xmlrpc"

oprintname = "openSprints()"
jira_search = 'http://jira.grupa.onet/rest/api/2/search?jql=project = "CMSP2WIDG" AND Type = Story \
        AND Sprint in openSprints()&fields=summary,customfield_11726,customfield_10002 '

if len(sys.argv) < 4:
       exit("Usage: " + sys.argv[0] + " userlogin projectname sprintAlias");

# test variables
username = sys.argv[1];
passwrd = getpass.getpass()
projectname = sys.argv[2];
sprint = sys.argv[3]

spacekey = "~trozanski"
pagetitle = sprint + " | " + projectname

# JIRA SEARCH PART
out = requests.get(jira_search, auth=('trozanski', passwrd))
jira_issues_tmp = out.content.replace("'", "\"")
jira_issues = json.loads(jira_issues_tmp).get('issues')

#####################################################################################################################
sum_story = 0
items_table = ""
for issue in jira_issues:
    KA =  issue["fields"].get("customfield_11726") and issue["fields"].get("customfield_11726").encode("utf-8") or "n/a"
    SP =  issue["fields"].get("customfield_10002", "0") and str(issue["fields"].get("customfield_10002", "0")) or "0"
    SUB = issue["fields"].get("summary").encode("utf-8")
    items_table +="""
            <tr>
                <td class="confluenceTd"><p>%s</p></td>
                <td colspan="1" class="confluenceTd">%s</td>
                <td style="text-align: center;" class="confluenceTd">%s</td>
                <td style="text-align: center;" class="confluenceTd">-</td>
                <td style="text-align: center;" colspan="1" class="confluenceTd"><span style="color: rgb(112,112,112);">Tak</span></td>
            </tr>
    """%(SUB, KA, SP)
    sum_story += float(SP)
input_html ="""
<div>
 <table border="1" class="confluenceTable">
    <tbody>
        <tr>
            <th class="confluenceTh">Kod sprintu</th>
            <th class="confluenceTh">IP 25.07.2016-08.08.2016</th>
            <th colspan="1" class="confluenceTh">25.07.2016</th>
            <th colspan="1" class="confluenceTh">08.08.2016</th>
        </tr>
    </tbody>
</table>
</div>

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
if dev != 1:
    server = xmlrpclib.Server(url);
    token = server.confluence2.login(username, passwrd);

    parentPage = {
            "space" : spacekey,
            "title" : projectname
            }
    parentId = server.confluence2.getPage(token, spacekey, projectname)
    if parentId.get("id") is None:
        exit("There is no a page " + projectname)

    page = {
            "space" : spacekey,
            "parentId" : parentId.get("id"),
            "title" : pagetitle,
            "content" : input_html
            }
    out = server.confluence2.storePage(token, page);

