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

def _get_all_projects(user):

    with open('projects.json', 'r') as f:
        project_data = f.read()
    project_data = project_data.replace("false", "False").replace("true", "True").replace("Null", "None")
    project_dict_full = eval(project_data)
    project_dict_my = [x for x in project_dict_full if (x["lead"]["name"] == user )]
    project_dict_my = sorted(project_dict_my, key=itemgetter("id"), reverse=True)
    if project_dict_my == []:
        return project_dict_my

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
            'avatar': project_dict_my[0]["lead"]["avatarUrls"]["32x32"],
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
            'user': user_full,
            }
    rr = json.dump(ret_json).replace("False", "false").replace("True", "true").replace("None", "Null")
    print(rr)
    return rr


if __name__ == '__main__':
    if len(sys.argv) < 2:
        exit("Usage: " + sys.argv[0] + " user [args]")
    print(_get_all_projects(sys.argv[1]))
    #_get_all_projects(sys.argv[1])
    exit(0)

