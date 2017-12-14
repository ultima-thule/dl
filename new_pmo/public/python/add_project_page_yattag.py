#!/usr/bin/python
# -*- coding: utf-8 -*-

import getpass
import sys

from dateutil import parser
import credentials
import lib.confluence
import lib.jira
import json
from yattag import Doc

user_cf = credentials.loginConfluence['consumer_secret']
pwd_cf = credentials.loginConfluence['password']
url = "http://doc.grupa.onet/rpc/xmlrpc"
confl = lib.confluence.Confluence(url, user_cf, pwd_cf, "PROJEKTY")

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
    if project is None:
        print("Brak projektu w portfolio")
        exit(0)
    page = confl.get_page(project_name)
    if page is None:
        print("Projekt nie został założony")
        exit(0)
    content = page.get("content", "")
    if project.cost_lbe is not None:
        content = content.replace("koszt projektu:",  "koszt projektu: " + str(project.cost_lbe * 107))
        content = content.replace("liczba godzin:",  "liczba godzin: " + str(project.cost_lbe))
    if project.start_date is None:
        project.start_date = project.created
    content = content.replace("Data otwarcia projektu:",  "Data otwarcia projektu: " + str(project.start_date))
    if project.end_date is not None:
        content = content.replace("Data zakończenia projektu:",  "Data zakończenia projektu: " + str(project.end_date))
    if project.mpk is not None:
        content = content.replace("MPK/PC:",  "MPK/PC: " + str(project.mpk))
    if project.po is not None:
        content = content.replace("Product Owner:",  "Product Owner: " + str(project.po))
        content = content.replace("Project Manager:",  "Project Manager: " + str(project.pm))
    content = content.replace('Developement Team: &nbsp;<a class="unresolved" href="http://doc.grupa.onet/" rel="nofollow">~histeryk</a>',  'Developement Team: &nbsp;<a class="unresolved" href="http://doc.grupa.onet/" rel="nofollow"> ' + str(project.team) + "</a>")
    goal = '*Cel projektu*</ac:parameter><ac:parameter ac:name="borderStyle">solid</ac:parameter><ac:parameter ac:name="borderColor">#F6F6F6</ac:parameter><ac:parameter ac:name="borderWidth">1</ac:parameter><ac:parameter ac:name="bordedColor">#BAD1DC</ac:parameter><ac:rich-text-body><ac:macro ac:name="excerpt"><ac:parameter ac:name="atlassian-macro-output-type">BLOCK</ac:parameter><ac:rich-text-body><p>'
    if project.description is not None:
        content = content.replace(goal,  goal + str(project.description))
    try:
        deltadate = parser.parse(project.end_date) - parser.parse(project.start_date)
        sprints = deltadate.days/10
        content = content.replace('Liczba sprint&oacute;w:', 'Liczba sprint&oacute;w:' + str(sprints))
    except Exception as msg:
        print(deltadate)
        print(msg)
    try:
        confl.create_page(page["title"], page["parentId"], content, page)
    except Exception as msg:
        print(msg)
        print("problem z updtem")
    print(content)
    #print(content)
    exit(0)

