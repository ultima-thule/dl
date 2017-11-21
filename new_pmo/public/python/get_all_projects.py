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
import pprint
from operator import itemgetter

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

    inprogress = [x for x in project_dict_my if (x.get("projectCategory", {}).get("name", "n/a")=="PROJEKTY W TOKU")]
    closed= [x for x in project_dict_my if (x.get("projectCategory", {}).get("name", "n/a")=="Zamknięte")]
    maitenance = [x for x in project_dict_my if (x.get("projectCategory", {}).get("name", "n/a")=="ROZWÓJ")]
    backlog = [x for x in project_dict_my if (x.get("projectCategory", {}).get("name", "n/a")=="BACKLOG")]
    rest = [x for x in project_dict_my if (x.get("projectCategory", {}).get("name", "n/a") not in ("PROJEKTY W TOKU", "BACKLOG", "ROZWÓJ", "Zamknięte"))]

    htmlout = '<h1><img src="' + project_dict_my[0]["lead"]["avatarUrls"]["32x32"] + '"/>'
    htmlout += ' ' + project_dict_my[0]["lead"]["displayName"]
    htmlout += "- projekty</h1> *godziny nie są jeszcze podpięte*";
    htmlinprogress = "<h2> Projekty w toku </h2>"
    htmlclosed = "<h2> Projekty zamknięte </h2>"
    htmlmaitenance = "<h2> Utrzymaniowe </h2>"
    htmlbacklog = "<h2>Kody backlogowe</h2>"
    htmlrest = "<h2> Pozostałe </h2>"

    def parse_html(pr):
        outtmphtml = pr['id'] + " \t <a href = 'http://doc.grupa.onet/display/PROJEKTY/" + pr['name'] + "'>"
        outtmphtml += pr['name']
        outtmphtml += '</a> \t <button onclick="window.location=\'http://pmo.cloud.onet/api/updateall/' + pr['name'] + '\'">Generuj doc (AC)</button> \t'
        outtmphtml += '</a> \t <button onclick="window.location=\'http://pmo.cloud.onet/api/updatealldesc/' + pr['name'] + '\'">Generuj doc (Desc)</button> \t'
        outtmphtml += ' spalonych godzin: 145/1200 \t deadline: 25.12.2017'
        outtmphtml += ' Portfolio: n/a ' + " <small>(" + pr.get("projectCategory", {}).get("name", "n/a") + ")</small> <br />"
        return outtmphtml

    def parse_extras(pr):
        print("parsuje")
        project = jira.get_project_data(pr["name"])
        if project is None:
            print("brak")
            outhtml = "Brak karteczki"
        else:
            print(project.name)
            outhtml = project.name
        return outhtml

    for data in inprogress:
        htmlinprogress += parse_html(data)
        #htmlinprogress += parse_extras(data)
    for data in closed:
        htmlclosed += parse_html(data)
    for data in maitenance:
        htmlmaitenance += parse_html(data)
    for data in backlog:
        htmlbacklog += parse_html(data)
    for data in rest:
        htmlrest += parse_html(data)

    htmlout += htmlinprogress
    htmlout += htmlclosed
    htmlout += htmlmaitenance
    htmlout += htmlbacklog
    htmlout += htmlrest
    return htmlout


if __name__ == '__main__':
    if len(sys.argv) < 2:
        exit("Usage: " + sys.argv[0] + " user [args]")

    print(_get_all_projects(sys.argv[1]))
    #_get_all_projects(sys.argv[1])
    exit(0)

