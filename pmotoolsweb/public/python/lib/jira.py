import json
import re
import requests
from dateutil import parser


class JiraSprint(object):
    """ Simple holder for Jira sprint data."""
    def __init__(self, sprint_id, query_result):
        self.id = sprint_id
        self.name = query_result["name"]
        self.date_from = parser.parse(query_result["startDate"]).strftime('%Y-%m-%d')
        self.date_to = parser.parse(query_result["endDate"]).strftime('%Y-%m-%d')

class JiraProject(object):
    """ Simple holder for the project data."""
    def __init__(self, project_name, query_result):
        self.name = project_name
        self.id = query_result["issues"][0]["key"]
        try:
            self.start_date = query_result["issues"][0]["fields"]["customfield_12232"]
            self.deploy_date = query_result["issues"][0]["fields"]["customfield_12234"]
            self.deploy_lbe = query_result["issues"][0]["fields"]["customfield_12233"]
            self.end_date = query_result["issues"][0]["fields"]["customfield_12228"]
            self.description = query_result["issues"][0]["fields"]["description"]
            self.pm = "nimrod"
            self.po = query_result["issues"][0]["fields"]["customfield_12244"]["displayName"]
            self.cost_lbe = query_result["issues"][0]["fields"]["customfield_12223"]
            self.cost_planned = query_result["issues"][0]["fields"]["customfield_12222"]
            self.cost_current = query_result["issues"][0]["fields"]["customfield_12238"]
            self.milestones = []
            self.sprints = query_result["issues"][0]["fields"]["customfield_10800"]
            self.mpk = query_result["issues"][0]["fields"]["customfield_12623"]
            self.team = query_result["issues"][0]["fields"]["customfield_12239"]["child"]["value"]
        except Exception as msg:
            print("Nie wszystkie dane zostaly wypelnione")
            print(msg)


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
        no_of_batches = int(total / max_results)
        if total % max_results != 0:
            no_of_batches += 1

        for i in range (no_of_batches):
            # print("Start at:" + str(start_at) + " max_results: " + str(max_results) + " total:" + str(total))
            data = func(*(args +(start_at + max_results, )))
            start_at = data["startAt"]
            max_results = data["maxResults"]
            issues += data["issues"]
        return issues

    def get_sprint_data(self, sprint_id):
        """ Gets sprint general data from Jira. """
        query = "/rest/agile/1.0/sprint/" + sprint_id
        return JiraSprint(sprint_id, self.search(query))

    def get_project_data(self, project_name):
        """ Gets project general data from Jira. """
        project_data = self._get_all_project_batch(project_name)
        project = JiraProject(project_name, project_data)
        sprints = self._get_sprints_for_project(project_name)
        sp = []
        for data in sprints["issues"]:
            x = data["fields"]["customfield_10800"]
            if x is not None:
                out = re.search("id=.*?,", x[0]).group(0)
                sp.append(int(out[3:-1]))
        sp_unit = {}.fromkeys(sp).keys()
        project.sprints = sp_unit
        return project

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
                + "&fields=status,issuetype,summary,description,customfield_11726,customfield_10002,aggregatetimespent" \
                + "&startAt=" + str(start_at)
        return self.search(query)

    def get_all_issues(self, project_name):
        """ Gets all issues within project, in several batches. """
        return self._search_in_batches(self._get_all_issues_batch, project_name)

    def _get_all_issues_batch(self, project_name, start_at):
        """ Gets all issues within project - one 50-elem batch. """
        #customfield_11300 = epic link, customfield_10800 = sprint, 11304 = rank
        query = "/rest/api/2/search?jql=project = '" + project_name + "'" \
                + "&fields=epiclink,status,issuetype,summary,timespent,aggregatetimespent,parent,customfield_11300,customfield_10800,customfield_11304" \
                + "&startAt=" + str(start_at)
        return self.search(query)

    def get_all_initiatives(self, project_name):
        """ Gets all issues within project, in several batches. """
        return self._search_in_batches(self._get_all_initiatives_batch, project_name)

    def _get_sprints_for_project(self, project_name):
        query = '/rest/api/2/search?jql=project="%s"' % project_name
        query += "&fields=customfield_10800"
        return self.search(query)


    def _get_all_initiatives_batch(self, project_name, start_at):
        """ Gets all issues within project - one 50-elem batch.
        Custom fields codes:
        customfield_12237 - Inititative status
        customfield_12227 - Risk status
        customfield_12240 - Risk description
        customfield_12231 - BO
        customfield_12239 - Owned by team
        customfield_12243 - Project code
        customfield_12226 - Project card
        customfield_12230 - Contract status
        customfield_12222 - Planned cost
        customfield_12223 - Cost LBE
        customfield_12238 - Current cost
        customfield_12232 - Started on
        customfield_12234 - Planned release on
        customfield_12233 - Release LBE on
        customfield_12228 - Finish on
        customfield_12244 - Product Owner
        customfield_12235 - Program manager or Coordinator

        summary,description,assignee,status,customfield_12237,customfield_12227,customfield_12240,customfield_12231,
        customfield_12239,customfield_12243,customfield_12226,customfield_12230,customfield_12222,customfield_12223,
        customfield_12238,customfield_12232,customfield_12234,customfield_12233,customfield_12228,customfield_12244

        """
        query = "/rest/api/2/search?jql=project='" + project_name + "' and fixVersion in unreleasedVersions()"
        # query += "&fields=summary,description,assignee,status,epicLink,customfield_12237,customfield_12227,"
        # query += "customfield_12240,customfield_12231,customfield_12239,customfield_12243,customfield_12226,"
        # query += "customfield_12230,customfield_12222,customfield_12223,customfield_12238,customfield_12232,"
        # query += "customfield_12234,customfield_12233,customfield_12228,customfield_12244,customfield_12235"
        query += "&expand=changelog&startAt=" + str(start_at)

        return self.search(query)

    def _get_all_project_batch(self, project_name):
        """ Gets all issues within project - one 50-elem batch.
        Custom fields codes:
        customfield_12237 - Inititative status
        customfield_12227 - Risk status
        customfield_12240 - Risk description
        customfield_12231 - BO
        customfield_12239 - Owned by team
        customfield_12243 - Project code
        customfield_12226 - Project card
        customfield_12230 - Contract status
        customfield_12222 - Planned cost
        customfield_12223 - Cost LBE
        customfield_12238 - Current cost
        customfield_12232 - Started on
        customfield_12234 - Planned release on
        customfield_12233 - Release LBE on
        customfield_12228 - Finish on
        customfield_12244 - Product Owner
        customfield_12235 - Program manager or Coordinator
        customfield_12623 - MPK or PC
        customfield_10800 - Sprint

        summary,description,assignee,status,customfield_12237,customfield_12227,customfield_12240,customfield_12231,
        customfield_12239,customfield_12243,customfield_12226,customfield_12230,customfield_12222,customfield_12223,
        customfield_12238,customfield_12232,customfield_12234,customfield_12233,customfield_12228,customfield_12244

        """
        query = '/rest/api/2/search?jql=project=PORT AND resolution=Unresolved AND "Project code"~"%s"' % project_name
        query += "&fields=summary,description,assignee,status,epicLink,customfield_12237,customfield_12227,"
        query += "customfield_12240,customfield_12231,customfield_12239,customfield_12243,customfield_12226,"
        query += "customfield_12230,customfield_12222,customfield_12223,customfield_12238,customfield_12232,"
        query += "customfield_12234,customfield_12233,customfield_12228,customfield_12244,customfield_12235,"
        query += "customfield_12623, customfield_10800"
        return self.search(query)


    def get_mobile_portfolio(self):
        """ Gets all issues within Mobile Program, in several batches. """
        return self._search_in_batches(self._get_mobile_portfolio_batch)


    def _get_mobile_portfolio_batch(self, start_at):
        """ Gets all issues within Mobile Program - one 50-elem batch.
        Custom fields codes:
        customfield_12237 - Inititative status
        customfield_12227 - Risk status
        customfield_12240 - Risk description
        customfield_12231 - BO
        customfield_12239 - Owned by team
        customfield_12243 - Project code
        customfield_12226 - Project card
        customfield_12230 - Contract status
        customfield_12222 - Planned cost
        customfield_12223 - Cost LBE
        customfield_12238 - Current cost
        customfield_12232 - Started on
        customfield_12234 - Planned release on
        customfield_12233 - Release LBE on
        customfield_12228 - Finish on
        customfield_12244 - Product Owner
        customfield_12235 - Program manager or Coordinator

        summary,description,assignee,status,customfield_12237,customfield_12227,customfield_12240,customfield_12231,
        customfield_12239,customfield_12243,customfield_12226,customfield_12230,customfield_12222,customfield_12223,
        customfield_12238,customfield_12232,customfield_12234,customfield_12233,customfield_12228,customfield_12244

        """
        query = "/rest/api/2/search?jql=project='PORTFOLIO' and 'Epic Link'=PORT-2456 and fixVersion in unreleasedVersions() order by status ASC, 'Started on'"
        # query += "&fields=summary,description,assignee,status,epicLink,customfield_12237,customfield_12227,"
        # query += "customfield_12240,customfield_12231,customfield_12239,customfield_12243,customfield_12226,"
        # query += "customfield_12230,customfield_12222,customfield_12223,customfield_12238,customfield_12232,"
        # query += "customfield_12234,customfield_12233,customfield_12228,customfield_12244,customfield_12235"
        query += "&expand=changelog&startAt=" + str(start_at)

        return self.search(query)
