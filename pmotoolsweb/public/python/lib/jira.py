import json

import requests
from dateutil import parser


class JiraSprint(object):
    """ Simple holder for Jira sprint data."""
    def __init__(self, sprint_id, query_result):
        self.id = sprint_id
        self.name = query_result["name"]
        self.date_from = parser.parse(query_result["startDate"]).strftime('%Y-%m-%d')
        self.date_to = parser.parse(query_result["endDate"]).strftime('%Y-%m-%d')


class JiraTimeSpent (object):
    """ Simple holder for collecting summary costs data."""
    def __init__(self):
        self.sum_story_points = 0.0
        self.sum_time_spent = 0.0
        self.table_tasks = {}


class Jira (object):
    """ Simple holder for connection and making requests to Jira."""

    def __init__(self, url, username, password):
        self.url = url
        self.username = username
        self.password = password

    def search(self, jql_search, result_key=None):
        """ Generic search method."""
        out = requests.get(self.url + jql_search, auth=(self.username, self.password))
        results = json.loads(out.content.decode())
        if result_key is not None:
            return results.get(result_key)
        return results

    def _search_in_batches(self, func, *args):
        """ Reads all 50-elem batches of data from Jira. """
        data = func(*(args + (0,)))
        issues = data["issues"]
        start_at = data["startAt"]
        max_results = data["maxResults"]
        total = data["total"]
        while (start_at + 1) * max_results < total:
            data = func(*(args +(start_at + max_results, )))
            start_at = data["startAt"]
            max_results = data["maxResults"]
            issues += data["issues"]
        return issues

    def get_sprint_data(self, sprint_id):
        """ Gets sprint general data from Jira. """
        query = "/rest/agile/1.0/sprint/" + sprint_id
        return JiraSprint(sprint_id, self.search(query))

    def get_worklogs_in_sprint(self, project_name, sprint):
        """ Gets worklogs within project and only in this sprint. """
        return self._search_in_batches(self._get_worklogs_in_sprint_batch, project_name, sprint)

    def _get_worklogs_in_sprint_batch(self, project_name, sprint, start_at):
        """ Gets worklogs within project and only in this sprint. """
        query = "/rest/api/2/search?jql=project='" + project_name + "'" \
                            "AND worklogDate>" + sprint.date_from + " AND worklogDate < " + sprint.date_to + "" \
                            "&fields=summary,customfield_11726,customfield_10002,worklog,parent" \
                            + "&startAt=" + str(start_at)
        #query = "/rest/api/2/search?jql=project='" + projectname + "' \
                            #AND id IN (ZUMISEARCH-59, ZUMISEARCH-60, ZUMISEARCH-61,ZUMISEARCH-62)&fields=worklog,aggregatetimespent,parent" \
                            #+ "&startAt=" + str(startAt)
        return self.search(query)

    def get_issues_in_sprint(self, project_name, sprint):
        """ Gets all issues within project and sprint, in several batches. """
        return self._search_in_batches(self._get_issues_in_sprint_batch, project_name, sprint)

    def _get_issues_in_sprint_batch(self, project_name, sprint, start_at):
        """ Gets all issues within project and sprint - one 50-elem batch. """
        query = "/rest/api/2/search?jql=project = '" + project_name \
                + "' AND Type != Sub-task AND sprint = " + sprint.id \
                + "&fields=status,issuetype,summary,customfield_11726,customfield_10002,aggregatetimespent" \
                + "&startAt=" + str(start_at)
        return self.search(query)

    def get_all_issues(self, project_name):
        """ Gets all issues within project, in several batches. """
        return self._search_in_batches(self._get_all_issues_batch, project_name)

    def _get_all_issues_batch(self, project_name, start_at):
        """ Gets all issues within project - one 50-elem batch. """
        #customfield_11300 = epic link, customfield_10800 = sprint, 11304 = rank
        query = "/rest/api/2/search?jql=project = '" + project_name + "'" \
                + "&fields=status,issuetype,summary,timespent,aggregatetimespent,parent,customfield_11300,customfield_10800,customfield_11304" \
                + "&startAt=" + str(start_at)
        return self.search(query)
