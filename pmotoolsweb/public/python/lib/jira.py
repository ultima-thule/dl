__author__ = 'asia'

import json
import requests

class Jira (object):

    def __init__(self, username, password):
        self.username = username
        self.password = password

    def search(self, jqlSearch, resultKey=None):
        out = requests.get(jqlSearch, auth=(self.username, self.password))
        results = json.loads(out.content.decode())

        if resultKey is not None:
            results = results.get(resultKey)

        return results
