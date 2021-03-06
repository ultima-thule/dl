import json
import re
import requests
import requests_cache
from dateutil import parser
from time import sleep


class JiraSprint(object):
    """ Simple holder for Jira sprint data."""
    def __init__(self, sprint_id, query_result):
        self.id = sprint_id
        self.name = query_result["name"]
        try:
            self.date_from = parser.parse(query_result["startDate"]).strftime('%Y-%m-%d')
        except:
            self.date_from = "n/a"
        try:
            self.date_to = parser.parse(query_result["endDate"]).strftime('%Y-%m-%d')
        except:
            self.date_from = "n/a"

class JiraProject(object):
    """ Simple holder for the project data."""
    def __init__(self, project_name, query_result={}):
        self.name = project_name
        self.project_data = query_result
        #try:
        #    self.project_data = query_result["issues"][0]["fields"]
        #except Exception as msg:
        #    self.sprints = ()
        #    print("Nie ma takiego projektu")
        #    return
        self.start_date = self.project_data.get("customfield_12232")
        self.created = self.project_data.get("created")
        self.project_code = self.project_data.get("customfield_12243")
        self.deploy_date = self.project_data.get("customfield_12234")
        self.deploy_lbe = self.project_data.get("customfield_12233")
        self.end_date = self.project_data.get("customfield_12228")
        self.description = self.project_data.get("description")
        self.pm = self.project_data.get("assignee", {}).get("displayName")
        self.cost_lbe = self.project_data.get("customfield_12223", 1)
        self.cost_planned = self.project_data.get("customfield_12222", 1)
        self.cost_current = self.project_data.get("customfield_12238", 0)
        self.milestones = []
        self.sprints = self.project_data.get("customfield_10800", ())
        if self.sprints is None:
            self.sprints = ()
        self.mpk = self.project_data.get("customfield_12623")
        try:
            self.po = self.project_data.get("customfield_12244", {})["displayName"]
            self.team = self.project_data.get("customfield_12239")["child"]["value"]
        except Exception as msg:
            self.po = None
            self.team = None
            #print("nie chcialo mi sie tego parsowac:P")


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

    def search(self, jql_search, result_key=None, cache=False):
        """ Generic search method."""
        #cache = 60*60*24
        out = ""
        if cache:
            try:
                requests_cache.install_cache('project_cache', backend='sqlite', expire_after=cache)
            except:
                requests_cache.install_cache('project_cache', backend='sqlite', expire_after=3600)
        try:
            try:
                #requests_cache.install_cache('project_cache', backend='sqlite', expire_after=86400)
                out = requests.get(self.url + jql_search, auth=(self.username, self.password))
            except requests.exceptions.ConnectionError as msg:
                print("test")
                print("Check the jql or jira request: ")
                print(msg)
            results = json.loads(out.content.decode())
            if result_key is not None:
                return results.get(result_key)
            return results
        except Exception as msg:
            print("Problem z pobraniem danych z jiry: ")
            print(msg)

    def _search_in_batches(self, func, *args):
        """ Reads all 50-elem batches of data from Jira. """
        data = func(*(args + (0,)))
        issues = data.get("issues", [])
        start_at = data.get("startAt", [])
        max_results = data.get("maxResults", 1)
        total = data.get("total", 0)
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
        try:
            query = "/rest/agile/1.0/sprint/" + sprint_id
            return JiraSprint(sprint_id, self.search(query))
        except Exception as msg:
            print("problem z pobraniem identyfikatora sprintu")
            print(msg)

    def get_project_data(self, project_name, cache=False):
        """ Gets project general data from Jira. """
        try:
            project_data = self._get_all_project_batch(project_name, cache)
            try:
                query_data = project_data["issues"][0]["fields"]
            except Exception as msg:
                #print("Nie ma takiego projektu")
                return JiraProject(project_name)
            project = JiraProject(project_name, query_data)
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
        except Exception as msg:
            print("Jakas dupa z projektem %s" % project_name)
            print(msg)
            return JiraProject(project_name)

    def get_portfolio_data(self):
        """ Gets current project portfolio general data from Jira. """
        portfolio_data = self._get_all_portfolio_batch()
        projects = {}
        for p in portfolio_data:
            print(p["fields"]["customfield_12243"])
            projects.update({p["fields"]["customfield_12243"] : JiraProject(p.name, p["fields"])})
        print(projects)
        return projects

    def get_worklogs_in_sprint(self, project_name, sprint):
        """ Gets worklogs within project and only in this sprint. """
        print("Pobieram dane ze sprintu: %s"%str(sprint))
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
        try:
            return self._search_in_batches(self._get_issues_in_sprint_batch, project_name, sprint)
        except Exception as msg:
            print("Problem z pobraniem taskow ze sprintu")
            print(msg)

    def get_onepager_data(self, user):
        #query = "/rest/api/2/search?jql=project=ONEPAGER AND creator=%s AND resolution='Unresolved'\\u003bmaxResults=100" % user
        query = "/rest/api/2/search?jql=project=ONEPAGER AND creator=%s AND resolution=Unresolved" % user
        data = self.search(query, cache=False)
        return data

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
                + "&fields=status,issuetype,summary,timespent,aggregatetimespent,parent,customfield_11300,customfield_10800,customfield_11304" \
                + "&startAt=" + str(start_at)
        return self.search(query)

    def get_all_initiatives(self, project_name):
        """ Gets all issues within project, in several batches. """
        return self._search_in_batches(self._get_all_initiatives_batch, project_name)

    def _get_sprints_for_project(self, project_name):
        query = '/rest/api/2/search?jql=project="%s"' % project_name
        query += "&fields=customfield_10800&maxResults=200"
        return self.search(query)


    def _get_all_initiatives_batch(self, project_name, start_at):
        """ Gets all issues within project - one 50-elem batch.
        """
        query = "/rest/api/2/search?jql=project='" + project_name + "' and fixVersion in unreleasedVersions()"
        query += "&expand=changelog&startAt=" + str(start_at)

        return self.search(query)

    def _get_all_portfolio_batch(self):
        """ Gets all issues within portfolio - one 50-elem batch.
        """
        query = "/rest/api/2/search?jql=project='PORT' and status not in (roadmap) "
        query += "&fields=summary,description,assignee,status,epicLink,customfield_12237,customfield_12227,"
        query += "customfield_12240,customfield_12231,customfield_12239,customfield_12243,customfield_12226,"
        query += "customfield_12230,customfield_12222,customfield_12223,customfield_12238,customfield_12232,"
        query += "customfield_12234,customfield_12233,customfield_12228,customfield_12244,customfield_12235,"
        query += "customfield_12623, customfield_10800"
        #query += "&expand=changelog&startAt=" + str(start_at)
        return self.search(query)

    def _get_all_project_batch(self, project_name, cache=False):
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
        try:
            #query = '/rest/api/2/search?jql=project=PORT AND resolution=Unresolved AND "Project code"~"%s"' % project_name
            query = '/rest/api/2/search?jql=project=PORT AND "Project code"~"%s"' % project_name
            query += "&fields=summary,description,assignee,status,epicLink,customfield_12237,customfield_12227,"
            query += "customfield_12240,customfield_12231,customfield_12239,customfield_12243,customfield_12226,"
            query += "customfield_12230,customfield_12222,customfield_12223,customfield_12238,customfield_12232,"
            query += "customfield_12234,customfield_12233,customfield_12228,customfield_12244,customfield_12235,"
            query += "customfield_12623, customfield_10800"
            return self.search(query)
        except Exception as msg:
            print("Problem z pobraniem danych projektowych z portfolio")
            print(msg)

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
