#!/usr/bin/python
# -*- coding: utf-8 -*-
# @author Tomek
# Method allows to experiment with jira API methods
# Project = offer (Mały, Średni, Duży miś)
# Epic = agreement ID (CRM ID)
# Story = service (Eg. Poczta, konto)
# Subtasc = Task TODO to run a service

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


if __name__ == '__main__':
    if len(sys.argv) < 2:
        exit("Usage: " + sys.argv[0] + " agreementid [args]")

    # variables
    ident = str(sys.argv[1])
    #args = sys.argv[2]
    if len(sys.argv) > 3:
        usernameJira = sys.argv[3]
        passwordJira = getpass.getpass()
    else:
        pass
    #TODO: change on console
    usernameJira = credentials.loginJira['consumer_secret']
    passwordJira = credentials.loginJira['password']


    #=====================================================
    # CONST
    #=====================================================
    headers = {"Content-Type": "application/json",
            "User-Agent": "Chrome"
            }
    jira_api = "http://jira.grupa.onet/rest/api/2/issue/"
    project_name = "MIS"
    story = {"name": "Story"}
    task = {"name": "Task"}
    epic = {"name": "Epic"}
    subtask = {"id" : "5"}
    #=====================================================
    #epic_name = ""
    # in case of creating subtasks
    #parent = {"key": "KEY_ID-123"}
    #
    #input_params = {
    #        "fields": {
    #                "project": {"key" : project_name},
    #                "issuetype": story,
    #                "summary": "",
    #                "description": "",
    #                "customfield_11300" : epic_name,
    #                "labels": "",
    #                #"parent" : parent,
    #            }
    #        }
    #=====================================================
    #=====================================================
    epic_name = "Umowa crm_id=%s" % str(ident)

    input_params = {"fields": {
                        "project": { "key" : project_name},
                        "issuetype": epic,
                        "customfield_11301": epic_name,
                        "summary" : "Agreement for CRM id = %s " % str(ident),
                    }
            }

    input_json = json.dumps(input_params)
    # JIRA SPRINT PART
    out = requests.post(jira_api, auth=HTTPBasicAuth(usernameJira, passwordJira), headers=headers, data = input_json)
    #jira_issues = json.loads(out.content.decode())
    jira_issues = out.content
    print(out.status_code)
    print(out.content.decode())

    exit(0)

