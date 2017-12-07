#!/usr/bin/python
# -*- coding: utf-8 -*-
# @author trozanski
# TYPE: PoC

import json
import requests
from requests.auth import HTTPBasicAuth
import sys

import xmlrpc.client
########################### PYTHON 3.5 modules ##################
from dateutil import parser
import credentials
import lib.jira
#################################################################
import getpass
from datetime import datetime, timedelta
from time import gmtime, strftime
import pprint
from operator import itemgetter
from dateutil import parser

usernameJira = credentials.loginJira['consumer_secret']
passwordJira = credentials.loginJira['password']
project_dict = {}

user_jira = credentials.loginJira['consumer_secret']
pwd_jira = credentials.loginJira['password']

jira = lib.jira.Jira('http://jira.grupa.onet', user_jira, pwd_jira)


def _get_all_projects(user):


    with open('projects.json', 'r') as f:
        project_data = f.read()
    project_data = project_data.replace("false", "False").replace("true", "True").replace("Null", "None")
    project_dict_full = eval(project_data)
    project_dict_my = [x for x in project_dict_full if (x["lead"]["name"] == user )]
    project_dict_my = sorted(project_dict_my, key=itemgetter("id"), reverse=True)
    if project_dict_my == []:
        return "<h1>no data for the user %s</h1>" % user

    inprogress = [x for x in project_dict_my if (x.get("projectCategory", {}).get("name", "n/a")=="PROJEKTY W TOKU")]
    closed= [x for x in project_dict_my if (x.get("projectCategory", {}).get("name", "n/a")=="Zamknięte")]
    maitenance = [x for x in project_dict_my if (x.get("projectCategory", {}).get("name", "n/a")=="ROZWÓJ")]
    backlog = [x for x in project_dict_my if (x.get("projectCategory", {}).get("name", "n/a")=="BACKLOG")]
    supported = [x for x in project_dict_my if (x.get("projectCategory", {}).get("name", "n/a")=="POMOCNICZY")]
    rest = [x for x in project_dict_my if (x.get("projectCategory", {}).get("name", "n/a") not in ("PROJEKTY W TOKU", "BACKLOG", "ROZWÓJ", "Zamknięte"))]

    try:
        onepager = jira.get_onepager_data(user)["issues"]
    except Exception as msg:
        print(msg)
    try:
        onepager_projects = [x for x in onepager if x.get("fields", {}).get('issuetype')['id'] == "7" ]
    except Exception as msg:
        print(msg)
        onepager_projects = []

    onepager_tasks = {}
    try:
        for tsk in onepager:
            if tsk.get("fields", {}).get('issuetype')['id'] != "7" :
                tmp = onepager_tasks.get(tsk["fields"]["parent"]["key"], [])
                tmp.append(tsk)
                onepager_tasks.update({tsk["fields"]["parent"]["key"]: tmp})
    except Exception as msg:
        print("bug: ")
        print(msg)
        onepager_tasks = []

    htmlout = '<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'
    htmlout += '<title> Centrum Sterowania </title>'
    htmlout += '</head>'
    htmlout += '<style>'
    htmlout += """
    .column {
        float: left;
            width: 50%;
            }

            /* Clear floats after the columns */
            .row:after {
                        content: "";
                            display: table;
                                clear: both;
                                }
    """
    htmlout += '</style>'
    htmlout += '<h1><img src="' + project_dict_my[0]["lead"]["avatarUrls"]["32x32"] + '"/>'
    htmlout += ' ' + project_dict_my[0]["lead"]["displayName"]
    htmlout += "- projekty</h1> (Uwaga- lista odświeża się co 24h)"
    htmlonepager = "<h2>Uruchomione <a href='http://doc.grupa.onet/display/METRYKI/OnePager%3A+Opis%2C+Instrukcja%2C+Dane+kontaktowe'>One Pagery</a> </h2>"
    htmlinprogress = "<h2> Projekty w toku </h2>"
    htmlclosed = "<h2> Projekty zamknięte </h2>"
    htmlmaitenance = "<h2> Utrzymaniowe </h2>"
    htmlbacklog = "<h2>Kody backlogowe</h2>"
    htmlsupported = "<h2>Kody pomocnicze</h2>"
    htmlrest = "<h2>Pozostałe </h2>"

    def parse_onepager(pr, tsk):
        outtmphtml = pr['key'] + " \t <a href = 'http://jira.grupa.onet/browse/" + pr['key'] + "'>"
        outtmphtml += pr['fields']['summary']
        outtmphtml += "</a><br />"
        outtmphtml += "<ul>"
        for i in tsk[pr['key']]:
            butt = ""
            color = ""
            if i["fields"]["status"]["name"] in ("Waiting", "InProgress"):
                color = "blue"
            elif i["fields"]["status"]["name"] in ("ToDo"):
                color = "red"
                parent_id = "1"
                step = "1"
                typ = "run"
                butt += '\t<button onclick="window.location=\'' + "http://pmo.cloud.onet/api/onepager/%s/%s" % (i["key"], typ)+ '\'">Wystartuj</button> \t'
                typ = "cancel"
                butt += '\t<button onclick="window.location=\'' + "http://pmo.cloud.onet/api/onepager/%s/%s" % (i["key"], typ) + '\'">Przeskocz</button> \t'
            elif i["fields"]["status"]["name"] in ("Resolved", "Close"):
                color = "green"

            outtmphtml += "<li><font size='3px' color='"
            outtmphtml += "%s'>" % color
            outtmphtml += butt
            outtmphtml += i["fields"]["status"]["name"]
            outtmphtml += ": "
            outtmphtml += i["fields"]["summary"]
            outtmphtml += "</font></li>"
            #print(i["fields"]["parent"]["fields"]["summary"])
        outtmphtml += "</ul>"
        return outtmphtml

    def parse_html(pr):
        outtmphtml = pr['id'] + " \t <a href = 'http://doc.grupa.onet/display/PROJEKTY/" + pr['name'] + "'>"
        outtmphtml += pr['name']
        outtmphtml += '</a> \t <button onclick="window.location=\'http://pmo.cloud.onet/api/updateall/' + pr['name'] + '\'">Generuj doc (AC)</button> \t'
        outtmphtml += '</a> \t <button onclick="window.location=\'http://pmo.cloud.onet/api/updatealldesc/' + pr['name'] + '\'">Generuj doc (Desc)</button> \t'
        #outtmphtml += ' Portfolio: n/a ' + " <small>(" + pr.get("projectCategory", {}).get("name", "n/a") + ")</small> "
        return outtmphtml

    def parse_old_html(pr):
        outtmphtml = pr['id'] + " \t <a href = 'http://doc.grupa.onet/display/PROJEKTY/" + pr['name'] + "'>"
        outtmphtml += pr['name']
        outtmphtml += '</a>'
        outtmphtml += '>> ' + " <small>(" + pr.get("projectCategory", {}).get("name", "n/a") + ")</small> "
        return outtmphtml

    def parse_extras(pr):
        project = jira.get_project_data(pr["name"])
        #print("Pobieram dane z: %s" % pr["name"])
        if project is None:
            #print("Brak danych w portfolio")
            outtmphtml = "<b><a href='http://jira.grupa.onet/secure/RapidBoard.jspa?rapidView=297'>Uzupełnij portfolio!</a></b>"
            color="orange"
        else:
            color = "black"
            if project.cost_planned is None:
                project.cost_planned = 1
                color = "orange"
            if project.cost_lbe is None:
                project.cost_lbe = project.cost_planned
            if project.cost_current is None:
                project.cost_current = 0
            if project.cost_lbe - project.cost_current < 0:
                color = "red"

            outtmphtml = "<p><font color = '"+color+"'>Aktualny koszt: " + str(project.cost_current) + "/" + str(project.cost_lbe) + " (" + str(round(project.cost_current/project.cost_lbe*100, 2)) + "%)</font><br />"
            #if project.cost_lbe == 1:
            #    outtmphtml += "<b><a href='http://jira.grupa.onet/secure/RapidBoard.jspa?rapidView=297'>Uzupełnij estymowany koszt</a></b><br />"
            outtmphtml += "Koszt zmieniony o: " + str(project.cost_lbe - project.cost_planned) + "<br />"
            outtmphtml += "Z budżetu zostało: " + str((project.cost_lbe - project.cost_current)*107) + "PLN + vat <br />"
            if project.start_date is None:
                project.start_date = project.created
            if project.end_date is None:
                project.end_date = 0
                color = "orange"
            if project.deploy_date is None:
                project.deploy_date = project.end_date
            outtmphtml += "<font color = '"+color+"'>Projekt trwa od: " + str(project.start_date) + " do: " + str(project.end_date) + "</font><br />"
            try:
                curdate = parser.parse(strftime("%Y-%m-%d %H:%M:%S", gmtime()))
                deploy = parser.parse(project.deploy_lbe) - curdate
                endofproject = parser.parse(project.end_date) - curdate
                color = "black"
                if (deploy.days <0 or endofproject.days<0):
                    color = "red"
                outtmphtml += "<font color = '"+color+"'>Do wdrożenia ostatecznej wersji pozostało: " + str(deploy) + " dni <br />"
                outtmphtml += "Do końca projektu pozostało: " + str(endofproject) + " dni </font><br />"
            except Exception as msg:
                outtmphtml += "Ustaw datę zakończenia projektui <br />"
            outtmphtml += "</p>"
        return outtmphtml

    for data in onepager_projects:
        htmlonepager += parse_onepager(data, onepager_tasks)

    for data in inprogress:
        htmlinprogress += parse_html(data)
        try:
            htmlinprogress += parse_extras(data)
        except:
            htmlinprogress += "<font color='red'>Jakiś problem z połączeniem z jirą. Sprawdź, czy jesteś zalogowany</font>"
        htmlinprogress += "<br />"
    i = 0
    for data in closed:
        # nie ma sensu wyświetlać więcej niż 10
        if i > 10:
            break
        htmlclosed += parse_old_html(data)
        htmlclosed += "<br />"
        i += 1
    for data in maitenance:
        htmlmaitenance += parse_old_html(data)
        htmlmaitenance += "<br />"
    for data in backlog:
        htmlbacklog += parse_old_html(data)
        htmlbacklog += "<br />"
    for data in rest:
        htmlrest += parse_old_html(data)
        htmlrest += "<br />"
    for data in supported:
        htmlsupported += parse_old_html(data)
        htmlsupported += "<br />"

    htmlout += "<div class='row'>"
    htmlout += "<div class='column'>"
    htmlout += htmlinprogress
    htmlout += htmlclosed
    htmlout += htmlmaitenance
    htmlout += htmlbacklog
    htmlout += htmlrest
    htmlout += "</div>"
    #htmlout += htmlsupported
    htmlout += "<div class='column'>"
    htmlout += htmlonepager
    htmlout += "</div>"
    htmlout += "</div>"
    return htmlout


if __name__ == '__main__':
    if len(sys.argv) < 2:
        exit("Usage: " + sys.argv[0] + " user [args]")
    print(_get_all_projects(sys.argv[1]))
    #_get_all_projects(sys.argv[1])
    exit(0)

