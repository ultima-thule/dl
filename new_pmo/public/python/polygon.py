#!/usr/bin/python
# -*- coding: utf-8 -*-
# @author trozanski
# Method allows to experiment with jira API methods
# Project = offer (Mały, Średni, Duży miś)
# Epic = agreement ID (CRM ID)
# Story = service (Eg. Poczta, konto)
# Subtask = Task TODO to run a service
#
# Proposed external API keys:
# ident - id from CRM
# services - list of services given to the agreement
# offer - one-word label for MIŚ type (to statistics purpose)
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
    project_name = "MIS" # CONST
    story = {"name": "Story"}
    task = {"name": "Task"}
    epic = {"name": "Epic"}
    subtask = {"id" : "5"}

    epic_name = "Umowa crm_id=%s" % str(ident)
    account_owner = "Jamrozik Ewelina" # get from CRM
    client = "Sisco Systemy Grzewcze" # get from CRM
    #=====================================================
    #=====================================================

    input_params = {"fields": {
                        "project": { "key" : project_name},
                        "issuetype": epic,
                        "customfield_11301": epic_name,
                        "summary" : "Agreement for CRM id = %s " % str(ident),
                    }
            }

    # Create the new agreement (= EPIC)
    input_json = json.dumps(input_params)
    out = requests.post(jira_api, auth=HTTPBasicAuth(usernameJira, passwordJira), headers=headers, data = input_json)
    new_epic = eval(out.content.decode())  # NEW AGREEMENT HAS BEEN ESTABILISHED

    # Get the REFERENCE stories based on products list predicted to given offer with given subtasks
    # MOCK:
    products = ("Pozycjonowanie Lokalne", "Moje Oferty", "Poczta Firmowa bez reklam", "Ruch na stronie internetowej", "Mailingi na start") # get this data from CRM- EXTERNAL API
    for product in products:
        try:
            jql_query = '/rest/api/2/search?jql=project = MIS AND Summary ~"%s" and "Epic Link" = MIS-68 '%product
            url = "http://jira.grupa.onet"  # TODO: move and merge with jira_api url
            reference_story = requests.get(url + jql_query, auth=(usernameJira, passwordJira)).content.decode()
            reference_story = reference_story.replace("null", "None")
            reference_story = reference_story.replace("true", "True")
            reference_story = reference_story.replace("false", "False")
            #print(eval(reference_story)["issues"])
        except Exception as msg:
            print("Problem z pobraniem danych")
            print(msg)
            continue # if the new product is not defined- should return sth to inform user
        input_params = eval(reference_story)["issues"][0]
        input_params.update({"fields": {
                            "project": { "key" : project_name},
                            "issuetype": story,
                            "summary" : product,
                            "description": "Some description",
                            "labels": ["MalyMis",], # get from CRM
                            "customfield_11300": new_epic["key"],
                        }
                })

        input_json = json.dumps(input_params)
        out = requests.post(jira_api, auth=HTTPBasicAuth(usernameJira, passwordJira), headers=headers, data = input_json)
        print(out.status_code)
        print(out.content)
        #products_subtasks.update({product: eval(out.content.decode())["id"]})


    # TODO: Add a constant process internal tasks:
    input_params = {"fields": {
                        "project": { "key" : project_name},
                        "issuetype": task,
                        "summary" : "Zamknięcie oferty",
                        "description": "Task procesowy do uzupełnienia/zaciągnięcia",
                        "labels": ["MalyMis",], # get from CRM
                        "customfield_11300": new_epic["key"],
                    }
            }
    input_json = json.dumps(input_params)
    out = requests.post(jira_api, auth=HTTPBasicAuth(usernameJira, passwordJira), headers=headers, data = input_json)
    print("Założono nową umowę")
    exit(0)

