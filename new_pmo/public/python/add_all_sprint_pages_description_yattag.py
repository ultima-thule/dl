#!/usr/bin/python
# -*- coding: utf-8 -*-

import getpass
import sys
import os

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
    print("get project data for " + project_name)
    project = jira.get_project_data(project_name)
    if project is None:
        print("Blad pobierania projektu")
        exit(1)
    print("create sprint pages")
    for sprint in project.sprints:
        os.system("python3.4 /home/httpd/dl/new_pmo/public/python/add_sprint_page_description_yattag.py %s %d"%(project_name, sprint))
    exit(0)

