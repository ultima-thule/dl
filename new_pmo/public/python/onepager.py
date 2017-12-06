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

user_jira_tr = "xxx"
pwd_jira_tr = "xxx"
jira = lib.jira.Jira('http://jira.grupa.onet', user_jira, pwd_jira)

def update_onepager(task_id, step, state="run"):
    """
        @run- assigne owner and the team
        @cancel- move to "resolved" (fast track)
    """

    jira_api = "http://jira.grupa.onet/rest/api/2/issue/%s" % str(task_id)
    headers = {"Content-Type": "application/json",
            "User-Agent": "Chrome"
            }
    if state == "cancel":
        input_params = {"fields": {
                            "status": "Resolved",
                        }
            }
    elif state == "run":
        print("GO!")
        pass

    input_json = json.dumps(input_params)
    #out = requests.put(jira_api, auth=(user_jira_tr, pwd_jira_tr), headers=headers, data = input_json)
    #return out
    return "test"


if __name__ == '__main__':
    if len(sys.argv) < 4:
        exit("Usage: " + sys.argv[0] + " parent step")
    parent_id = sys.argv[1]
    step = sys.argv[2]
    typ = sys.argv[3]
    if int(step) > 14:
        print("Nie ma takiego kroku!")
        exit(0)
    out = """
    <head><script type="text/javascript">
    setTimeout(
    function ( )
    {
      self.close();
      }, 1000 );
      </script></head>
    """
    #print(update_onepager(task_id, step, typ).text)
    #_get_all_projects(sys.argv[1])
    print(out)
    print(parent_id)
    print(step)
    print(typ)
    exit(0)
