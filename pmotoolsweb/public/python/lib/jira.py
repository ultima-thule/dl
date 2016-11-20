import json
import requests
from dateutil import parser


class JiraSprint(object):
    """ Simple holder for Jira sprint data."""
    def __init__(self, sprintId, queryResult):
        self.id = sprintId
        self.name = queryResult["name"]
        self.dateFrom = parser.parse(queryResult["startDate"]).strftime('%Y-%m-%d')
        self.dateTo = parser.parse(queryResult["endDate"]).strftime('%Y-%m-%d')


class JiraTimeSpent (object):
    """ Simple holder for collecting summary costs data."""
    def __init__(self):
        self.sumStoryPoints = 0.0
        self.sumTimeSpent = 0.0
        self.tableTasks = {}


class Jira (object):
    """ Simple holder for connection and making requests to Jira."""

    def __init__(self, url, username, password):
        self.url = url
        self.username = username
        self.password = password

    def search(self, jqlSearch, resultKey=None):
        """ Generic search method."""
        out = requests.get(self.url + jqlSearch, auth=(self.username, self.password))
        results = json.loads(out.content.decode())

        if resultKey is not None:
            results = results.get(resultKey)

        return results

    def getSprintData(self, sprintID):
        """ Gets sprint general data from Jira. """
        query = "/rest/agile/1.0/sprint/" + sprintID
        return JiraSprint(sprintID, self.search(query))

    def getWorklogsInSprint(self, projectName, sprint):
        """ Gets worklogs within project and only in this sprint. """
        query = "/rest/api/2/search?jql=project='" + projectName + "' \
                            AND worklogDate>%s AND worklogDate<%s&fields=summary,customfield_11726,customfield_10002,worklog,parent"\
                            %(sprint.dateFrom, sprint.dateTo)
        #query = "/rest/api/2/search?jql=project='" + projectname + "' \
                            #AND id IN (ZUMISEARCH-59, ZUMISEARCH-60, ZUMISEARCH-61,ZUMISEARCH-62)&fields=worklog,aggregatetimespent,parent"

        return self.search(query, 'issues')

    def getIssuesInSprint(self, projectName, sprint):
        """ Gets all issues within project and sprint. """
        query = "/rest/api/2/search?jql=project = '" + projectName + "' AND Type != Sub-task AND sprint = " + sprint.id \
                      + "&fields=status,issuetype,summary,customfield_11726,customfield_10002,aggregatetimespent"

        return self.search(query, 'issues')
