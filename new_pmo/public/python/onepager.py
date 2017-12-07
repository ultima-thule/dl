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

user_jira_tr = "trozanski"
pwd_jira_tr = "Bordeaux32"
jira = lib.jira.Jira('http://jira.grupa.onet', user_jira, pwd_jira)


def update_onepager(task_id, state="run"):
    """
        @run- assigne owner and the team
        @cancel- move to "resolved" (fast track)
    """

    headers = {"Content-Type": "application/json",
            "User-Agent": "Chrome"
            }
    jira_api = "http://jira.grupa.onet/rest/api/2/issue/%s" % str(task_id)

    onepager = requests.get(jira_api, auth=(user_jira, pwd_jira), headers=headers).content.decode()
    result = json.loads(onepager)
    parent = result["fields"]["parent"]["fields"]["summary"]
    parent_id = result["fields"]["parent"]["key"]

    identyfication_name = re.search("\[.*\]", parent.replace("[OnePager]", "")).group(0)[1:-1]
    new_summary = result["fields"]["summary"].replace("Nazwa Identyfikująca", identyfication_name).replace("CLONE - ", "")
    procedure_owner = result["fields"]["creator"]["name"]
    step = int(re.search("\d+", new_summary).group(0))
    steps_assigment = {
        1: [procedure_owner, ""],
        2: [procedure_owner, ""],
        3: ["nlojewska", "Zespół Produktu Reklamowego"],
        4: ["akomedera", "Zespół Analiz Rynkowych"],
        5: ["mbocian", "Zespół Traffic Intelligence"],
        6: ["mbocian", "Zespół Traffic Intelligence"],
        7: ["nlojewska", "Zespół Produktu Reklamowego"],
        8: [procedure_owner, ""],
        9: ["sszczerbowski", "Zespół Quality Assurance Services"],
        10: ["mbocian", "Zespół Traffic Intelligence"],
        11: ["akomedera", "Zespół Analiz Rynkowych"],
        12: ["mkapturkiewicz", "Zespół Data Analytics Platforms"],
        13: ["nlojewska", "Zespół Produktu Reklamowego"],
        14: [procedure_owner, ""],
        }

    metric_meta = parent_id.split("-")
    metric_id = int(metric_meta[1]) + 1
    metric_name = metric_meta[0]
    metric_key = metric_name + "-" + str(metric_id)
    jira_comment = "http://jira.grupa.onet/rest/api/2/issue/%s/comment" % str(metric_key)
    comment = requests.get(jira_comment, auth=(user_jira, pwd_jira), headers=headers).content.decode()
    com_result = json.loads(comment)

    try:
        com_body = com_result["comments"][0]["body"]
        metrics = re.search("http://.*", com_body).group(0)
    except Exception as msg:
        metrics = "..."

    new_description = result["fields"]["description"].replace("Adres *Metryki*", "Adres *Metryki*" + metrics)

    if state == "cancel":
        input_params = {
            "transition": {"id": "3"},
            "fields": {"summary": new_summary}
            }
    elif state == "run":
        """update:
            - task name (from parent) []from summary
            - assignee (const)
            - team (const) customfield_12204
            - metrics (from parent) metrics from description
        """
        input_params = {
                    "fields" : {
                        "summary": new_summary,
                        "description" : new_description,
                        "customfield_12204": {"value": steps_assigment.get(step)[1]},
                        "assignee": {"name": steps_assigment.get(step)[0]},
                        }
                }

    input_json = json.dumps(input_params)
    print(input_json)
    #return input_json
    out = requests.put(jira_api+"/transitions", auth=(user_jira_tr, pwd_jira_tr), headers=headers, data = input_json)
    #out = requests.get(jira_api+"/transitions", auth=(user_jira_tr, pwd_jira_tr), headers=headers)
    print(out.content.decode())
    return out.status_code()


if __name__ == '__main__':
    if len(sys.argv) < 3:
        exit("Usage: " + sys.argv[0] + " parent step")
    task_id = sys.argv[1]
    typ = sys.argv[2]
    out = """
    <head><script type="text/javascript">
    setTimeout(
    function ( )
    {
      self.close();
      }, 1000 );
      </script></head>
    """
    #_get_all_projects(sys.argv[1])
    print(out)
    print(update_onepager(task_id, typ))
    #print(update_onepager(task_id, typ).text)
    exit(0)
