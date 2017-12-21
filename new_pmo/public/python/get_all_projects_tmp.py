#!/usr/bin/python
# -*- coding: utf-8 -*-
# @author trozanski
# TYPE: PoC

import json
import requests
from requests.auth import HTTPBasicAuth
import sys
import re

import xmlrpc.client
########################### PYTHON 3.5 modules ##################
from dateutil import parser
import credentials
import lib.jira
import lib.confluence
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

def _check_cfl_projects(project):
    user_cf = credentials.loginConfluence['consumer_secret']
    pwd_cf = credentials.loginConfluence['password']

    # CONSOLERUN: uncomment on console

    url = "http://doc.grupa.onet/rpc/xmlrpc"
    confl = lib.confluence.Confluence(url, user_cf, pwd_cf, "PROJEKTY")
    return confl.get_page(project)

def get_extras(pr_name):
     project = jira.get_project_data(pr_name)
     err = ""
     if project is None:
         err =  "<a target='_blank' href='http://jira.grupa.onet/secure/RapidBoard.jspa?rapidView=297'>Uzupełnij portfolio!</a>"
     else:
         if project.cost_planned is None:
             project.cost_planned = 1
         if project.cost_lbe is None:
             project.cost_lbe = project.cost_planned
         if project.cost_current is None:
             project.cost_current = 0
         if project.start_date is None:
             project.start_date = project.created
         if project.end_date is None:
             project.end_date = 0
         if project.deploy_date is None:
             project.deploy_date = project.end_date
         try:
             curdate = parser.parse(strftime("%Y-%m-%d %H:%M:%S", gmtime()))
             endofproject = parser.parse(project.end_date) - curdate
         except Exception as msg:
             err = "Ustaw datę zakończenia projektu"
     ret = {"cost_current": project.cost_current,
             "cost_lbe": project.cost_lbe,
             "cost_planned" : project.cost_planned,
             "cost_burned": round(100 * (project.cost_lbe - project.cost_current)/project.cost_lbe),
             "cost_overlap": (project.cost_lbe - project.cost_current) < 0,
             "cost_rest": round(100 * (project.cost_current)/project.cost_lbe),
             "start_date": project.start_date,
             "end_date": project.end_date,
             "curdate": str(curdate),
             "endofproject": str(endofproject),
             "description": project.description,
             "team": project.team
             }
     return ret

def _get_all_projects(user):

    with open('projects.json', 'r') as f:
        project_data = f.read()
    #project_data = project_data.replace("false", "False").replace("true", "True").replace("Null", "None")
    project_dict_full = json.loads(project_data)
    #project_dict_full = eval(project_data)
    project_dict_my = [x for x in project_dict_full if (x["lead"]["name"] == user )]
    project_dict_my = sorted(project_dict_my, key=itemgetter("id"), reverse=True)
    if project_dict_my == []:
        return project_dict_my

    inprogress = [x for x in project_dict_my if (x.get("projectCategory", {}).get("name", "n/a")=="PROJEKTY W TOKU")][:3]
    closed= [x for x in project_dict_my if (x.get("projectCategory", {}).get("name", "n/a")=="Zamknięte")]
    maitenance = [x for x in project_dict_my if (x.get("projectCategory", {}).get("name", "n/a")=="ROZWÓJ")]
    backlog = [x for x in project_dict_my if (x.get("projectCategory", {}).get("name", "n/a")=="BACKLOG")]
    supported = [x for x in project_dict_my if (x.get("projectCategory", {}).get("name", "n/a")=="POMOCNICZY")]
    rest = [x for x in project_dict_my if (x.get("projectCategory", {}).get("name", "n/a") not in ("PROJEKTY W TOKU", "BACKLOG", "ROZWÓJ", "Zamknięte"))]

    for tsk in inprogress:
       tsk["extras"] = get_extras(tsk["name"])

    try:
        onepager = jira.get_onepager_data(user)["issues"]
    except Exception as msg:
        print(msg)

    try:
        onepager_projects = [x for x in onepager if x.get("fields", {}).get('issuetype')['id'] == "7" ]
    except Exception as msg:
        print("cos nie tak")
        onepager_projects = []

    onepager_tasks = {}
    try:
        for tsk in onepager:
            if tsk.get("fields", {}).get('issuetype')['id'] != "7" :
                tmp = onepager_tasks.get(tsk["fields"]["parent"]["key"], [])
                tmp.append(tsk)
                onepager_tasks.update({tsk["fields"]["parent"]["key"]: tmp})
    except Exception as msg:
        pass

    user_full = {
            'avatar': project_dict_my[0]["lead"]["avatarUrls"]["48x48"],
            'name': project_dict_my[0]["lead"]["displayName"],
            'user': user,
            }

    ret_json = {
            'inprogress': inprogress,
            'closed': closed,
            'maitenance': maitenance,
            'backlog': backlog,
            'supported': supported,
            'rest': rest,
            'onepager': onepager_tasks,
            'user': user_full,
            }
    rr = json.dumps(ret_json).replace("'", "\"")
    return  rr


if __name__ == '__main__':
    if len(sys.argv) < 2:
        exit("Usage: " + sys.argv[0] + " user [args]")
    print(_get_all_projects(sys.argv[1]))
    #_get_all_projects(sys.argv[1])
    exit(0)

