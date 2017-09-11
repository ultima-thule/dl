#!/usr/bin/python
# -*- coding: utf-8 -*-

import getpass
import sys

import credentials
import lib.confluence
import lib.jira
import json
from yattag import Doc


if __name__ == '__main__':
    dev = 0
    if len(sys.argv) < 2:
        exit("Usage: " + sys.argv[0] + " projectname")

    #====================================================
    # If the script is running from the console this part
    # allows to catch the proper variables
    #====================================================
    project_name = sys.argv[1]
    if len(sys.argv) > 3:
        user_jira = sys.argv[2]
        pwd_jira = getpass.getpass()
    else:
        pass

    #====================================================
    # Init Jira connection
    #====================================================
    # CONSOLERUN: comment two lines:
    user_jira = credentials.loginJira['consumer_secret']
    pwd_jira = credentials.loginJira['password']
    jira = lib.jira.Jira('http://jira.grupa.onet', user_jira, pwd_jira)

    #====================================================
    # GET-DATA BLOCK
    #====================================================
    # Get the sprint general data
    project = jira.get_project_data(project_name)
    print("under construction....")
    #json.dumps(project)
    exit(0)

