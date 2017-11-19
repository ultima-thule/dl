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
    out = requests.get(jira_api, auth=HTTPBasicAuth(usernameJira, passwordJira))
    with open('projects.json', 'w') as f:
        f.write(out.content.decode())
    if f.close():
        print("Zapisano projekty")
    return

def _get_all_projects():
    with open('projects.json', 'r') as f:
        project_data = f.read()
    project_data = project_data.replace("false", "False").replace("true", "True").replace("Null", "None")
    project_dict_full = eval(project_data)
    return [[x["key"], x["name"]] for x in project_dict_full if (x["lead"]["name"] == "trozanski" )]


if __name__ == '__main__':
    if len(sys.argv) < 2:
        exit("Usage: " + sys.argv[0] + " agreementid [args]")

    #_save_all_projects()
    print(_get_all_projects())
    exit(0)

