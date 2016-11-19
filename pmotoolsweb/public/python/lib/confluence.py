__author__ = 'asia'

import xmlrpc.client

class Confluence (object):

    def __init__(self, url, username, password, spacekey):
        self.server = xmlrpc.client.ServerProxy(url)
        self.token = self.server.confluence2.login(username, password)
        self.spaceKey = spacekey


    def getOrCreatePage(self, title, parentID, content):
        pageId = None

        try:
            pageId = self.server.confluence2.getPage(self.token, self.spaceKey, title)
        except:
            if self.createPage(title, parentID, content) is not None:
                pageId = self.server.confluence2.getPage(self.token, self.spaceKey, title)

        return pageId


    def updateOrCreatePage(self, title, parentID, content):
        pageId = None

        try:
            pageId = self.server.confluence2.getPage(self.token, self.spaceKey, title)
        except:
            if self.createPage(title, parentID, content) is not None:
                pageId = self.server.confluence2.getPage(self.token, self.spaceKey, title)
                return pageId
        try:
            if self.createPage(title, parentID, content, pageId) is not None:
                return pageId
        except:
            #print(msg)
            pass
        return pageId


    def createPage(self, title, parentID, content, pageId=None):
        newPage = None
        page = {
                "space": self.spaceKey,
                "parentId": parentID,
                "title": title,
                "content": content,
                }
        if pageId is not None:
            page = {
                    "id": pageId["id"],
                    "space": self.spaceKey,
                    "parentId": parentID,
                    "title": title,
                    "content": content,
                    "version": pageId["version"],
                    }
        try:
            newPage = self.server.confluence2.storePage(self.token, page)
        except Exception as msg:
            print(msg)

        return newPage

