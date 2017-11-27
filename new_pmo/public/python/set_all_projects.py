#!/usr/bin/python
# -*- coding: utf-8 -*-
# @author trozanski
# TYPE: PoC

import json
import requests
import requests_cache
from requests.auth import HTTPBasicAuth
import sys

import xmlrpc.client
########################### PYTHON 3.5 modules ##################
from dateutil import parser
import credentials
#################################################################
import getpass
from datetime import datetime, timedelta
import pprint

usernameJira = credentials.loginJira['consumer_secret']
passwordJira = credentials.loginJira['password']
project_dict = {}

def _save_all_projects():
    jira_api = "http://jira.grupa.onet/rest/api/2/project?expand=lead"

    #input_json = json.dumps(input_params)
    requests_cache.install_cache('project_cache', backend='sqlite', expire_after=86400)
    out = requests.get(jira_api, auth=HTTPBasicAuth(usernameJira, passwordJira))
    with open('projects.json', 'w') as f:
        f.write(out.content.decode())
    if f.close():
        print("Zapisano projekty")

    project_list = _get_all_projects()


    for project_name in project_list:
        print("Parsing %s" % project_name)
        query = 'http://jira.grupa.onet/rest/api/2/search?jql=project=PORT%20AND%20"Project%20code"~"' + project_name + '"'
        query += '&fields=summary,description,assignee,status,epicLink,customfield_12237,customfield_12227,'
        query += "customfield_12240,customfield_12231,customfield_12239,customfield_12243,customfield_12226,"
        query += "customfield_12230,customfield_12222,customfield_12223,customfield_12238,customfield_12232,"
        query += "customfield_12234,customfield_12233,customfield_12228,customfield_12244,customfield_12235,"
        query += "customfield_12623,customfield_10800"
        out = requests.get(query, auth=(usernameJira, passwordJira))
        print(out.status_code)
    return

def _get_all_projects():
    with open('projects.json', 'r') as f:
        project_data = f.read()
    project_data = project_data.replace("false", "False").replace("true", "True").replace("Null", "None")
    project_dict_full = eval(project_data)
    return [x["name"] for x in project_dict_full if (x.get("projectCategory", {}).get("name", "") == "PROJEKTY W TOKU" )]


if __name__ == '__main__':

    _save_all_projects()
    #print(_get_all_projects())
    exit(0)

