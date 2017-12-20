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
    return project_data


if __name__ == '__main__':
    if len(sys.argv) < 2:
        exit("Usage: " + sys.argv[0] + " user [args]")
    print(_get_all_projects(sys.argv[1]))
    #_get_all_projects(sys.argv[1])
    exit(0)

