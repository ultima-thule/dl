__author__ = 'asia'

# Copyright 2011-2012 Canonical Ltd
# -*- coding: utf-8 -*-

import requests
from requests.auth import HTTPBasicAuth
import json
import operator
from pprint import pprint
import re
import time
import datetime
import argparse


ANNOTATION_REGEX = re.compile('^\s*{.*}\s*$', re.MULTILINE|re.DOTALL)

globalFetchComments = True

class Record(dict):
    """A little dict subclass that adds attribute access to values."""

    def __hash__(self):
        return hash(repr(self))

    def __getattr__(self, name):
        try:
            return self[name]
        except KeyError as e:
            raise AttributeError(e)

    def __setattr__(self, name, value):
        self[name] = value


class LeankitResponseCodes:
    """Enum listing all possible response codes from LeankitKanban API."""
    NoData = 100
    DataRetrievalSuccess = 200
    DataInsertSuccess = 201
    DataUpdateSuccess = 202
    DataDeleteSuccess = 203
    SystemException = 500
    MinorException = 501
    UserException = 502
    FatalException = 503
    ThrottleWaitResponse = 800
    WipOverrideCommentRequired = 900
    ResendingEmailRequired = 902
    UnauthorizedAccess = 1000

    SUCCESS_CODES = [
        DataRetrievalSuccess,
        DataInsertSuccess,
        DataUpdateSuccess,
        DataDeleteSuccess,
        ]


class LeankitConnector(object):
    def __init__(self, account, username=None, password=None, throttle=1):
        host = 'https://' + account + '.leankit.com'
        self.base_api_url = host + '/Kanban/Api'
        self.http = self._configure_auth(username, password)
        self.last_request_time = time.time() - throttle
        self.throttle = throttle

    def _configure_auth(self, username=None, password=None):
        """Configure the http object to use basic auth headers."""
        http = requests.sessions.Session()
        if username is not None and password is not None:
            http.auth = HTTPBasicAuth(username, password)
        return http

    def post(self, url, data, handle_errors=True):
        data = json.dumps(data)
        return self._do_request("POST", url, data, handle_errors)

    def get(self, url, handle_errors=True):
        return self._do_request("GET", url, None, handle_errors)

    def _do_request(self, action, url, data=None, handle_errors=True):
        """Make an HTTP request to the given url possibly POSTing some data."""
        assert self.http is not None, "HTTP connection should not be None"
        headers = {'Content-type': 'application/json'}

        # Throttle requests to leankit to be no more than once per THROTTLE
        # seconds.
        now = time.time()
        delay = (self.last_request_time + self.throttle) - now
        if delay > 0:
            time.sleep(delay)
        self.last_request_time = time.time()
        try:
            resp = requests.get (self.base_api_url + url, auth=self.http.auth)
        except Exception as e:
            raise IOError("Unable to make HTTP request: %s" % e.message)

        if (resp.status_code not in LeankitResponseCodes.SUCCESS_CODES):
            print ("Error from kanban")
            pprint(resp)
            raise IOError('kanban error %d' % (resp.status_code))

        response = Record(json.loads(resp.text))

        if (handle_errors and
            response.ReplyCode not in LeankitResponseCodes.SUCCESS_CODES):
            raise IOError('kanban error %d: %s' % (
                response.ReplyCode, response.ReplyText))
        return response


class Converter(object):
    """Convert JSON returned by Leankit to Python classes.

    JSON returned by Leankit is in the form of a dict with CamelCase
    named values which are converted to lowercase underscore-separated
    class attributes.

    Any required attributes are defined in attribute 'attributes',
    and optional ones in 'optional_attributes' using the originating
    key names (CamelCase).  Optional values will be set to None if
    they are not defined.

    Whenever any of required or optional attributes are modified,
    is_dirty will be set to True and dirty_attrs will contain a set
    of modified attributes.
    """
    attributes = []
    optional_attributes = []

    def direct_setattr(self, attr, value):
        super(Converter, self).__setattr__(attr, value)

    def __init__(self, raw_data):
        self.direct_setattr('is_dirty', False)
        self.direct_setattr('dirty_attrs', set([]))
        self.direct_setattr('_raw_data', raw_data)
        self.direct_setattr('_watched_attrs', set([]))

        for attr in self.attributes:
            attr_name = self._prettifyName(attr)
            self._watched_attrs.add(attr_name)
            self.direct_setattr(attr_name, raw_data[attr])

        for attr in self.optional_attributes:
            attr_name = self._prettifyName(attr)
            self._watched_attrs.add(attr_name)
            self.direct_setattr(attr_name, raw_data.get(attr, None))

    def _prettifyName(self, camelcase):
        camelcase = camelcase.replace('ID', '_id')
        if len(camelcase) > 1:
            repl_func = lambda match: '_' + match.group(1).lower()
            camelcase = camelcase[0].lower() + camelcase[1:]
            return re.sub('([A-Z])', repl_func, camelcase)
        else:
            return camelcase.lower()

    def _toCamelCase(self, name):
        if len(name) > 1:
            repl_func = lambda match: match.group(1)[1:].upper()
            name = name[0].upper() + name[1:]
            return re.sub('(_[a-z])', repl_func, name)
        else:
            return name.upper()

    def __setattr__(self, attr, value):
        if ((not hasattr(self, attr) or
             getattr(self, attr, None) != value) and
            attr in self._watched_attrs):
            self.direct_setattr('is_dirty', True)
            self.dirty_attrs.add(attr)
        self.direct_setattr(attr, value)


class LeankitBoardUpdate(Converter):
    attributes = ['HasUpdates', 'CurrentBoardVersion']


class LeankitUser(Converter):
    attributes = ['UserName', 'FullName', 'EmailAddress', 'Id', 'Enabled', 'Role', 'RoleName']


class LeankitCardType(Converter):
    attributes = ['Name', 'IsDefault', 'ColorHex', 'IconPath', 'Id']


class LeankitCard(Converter):
    attributes = ['Id', 'Title', 'Priority', 'Description', 'Tags',
                  'TypeId']

    optional_attributes = ['Active', 'AssignedUserId', 'AssignedUserIds', 'AssignedUserName', 'AttachmentsCount',
                            'BlockReason', 'BlockStateChangeDate', 'BoardId', 'BoardTitle', 'ClassOfServiceId',
                            'ClassOfServiceTitle', 'CommentsCount', 'CurrentTaskBoardId', 'CreateDate',
                            'DateArchived', 'DueDate', 'ExternalCardId', 'ExternalSystemName',
                            'ExternalSystemUrl', 'Index', 'IsBlocked', 'LaneId', 'LastActivity', 'LastComment',
                            'LastMove', 'ParentCardId', 'PriorityText', 'Size', 'StartDate',
                            'TaskBoardCompletedCardCount', 'TaskBoardCompletedCardSize',
                            'TaskBoardCompletionPercent', 'TaskBoardTotalCards', 'TaskBoardTotalSize',
                            'TypeName', 'Version']


    base_uri = '/Boards/'


    def __init__(self, card_dict, lane):
        super(LeankitCard, self).__init__(card_dict)

        if lane is not None:
            self.lane = lane
            self.tags_list = set([tag.strip() for tag in self.tags.split(',')])
            if '' in self.tags_list:
                self.tags_list.remove('')
            self.type = lane.board.cardtypes[self.type_id]
        self.comments = []


    def fetchComments(self):
        print ("Fetching comments for ", self.title)
        url = '/Card/GetComments/{0}/{1}'.format(self.lane.board.id, self.id)

        comment_data = self.lane.board.connector.get(
            url).ReplyData[0]
        self.comments = []
        for comment_obj in comment_data:
            comment = LeanKitComment(comment_obj)
            self.comments.append(comment)
        self.comments.sort(key=operator.attrgetter('post_date'), reverse=True)


class LeanKitComment (Converter):
    attributes = ['Id', 'Text', 'PostDate', 'PostedById', 'PostedByFullName']
    optional_attributes = ['TaggedUsers', 'PostedByGravatarLink', 'Editable']


class LeankitLane(Converter):
    attributes = ['Id', 'Title', 'Index', 'Orientation', 'ParentLaneId']
    optional_attributes = ['Type']

    def __init__(self, lane_dict, board):
        super(LeankitLane, self).__init__(lane_dict)
        self.parent_lane = None
        self.board = board
        self.child_lanes = []
        self.cards = [LeankitCard(card_data, self)
                      for card_data in lane_dict['Cards']
                      if card_data['TypeId']]

    @property
    def path(self):
        components = [self.title]
        lane = self.parent_lane
        while lane is not None:
            if lane.id != 0:
                components.insert(0, lane.title)
            lane = lane.parent_lane
        return '::'.join(components)

    def _getChildrenDeep(self, lane):
        if len(lane.child_lanes) == 0:
            # Can't go any deeper.
            return lane
        else:
            if lane.orientation == 1:
                # Any of the following child lanes is a candidate.
                return [self._getChildrenDeep(child)
                        for child in lane.child_lanes]
            else:
                return self._getChildrenDeep(lane.child_lanes[0])

    def _getNextLanes(self, parent_lane, index, orientation):
        result = None
        if parent_lane is None:
            return None
        if orientation != 1:
            # No lanes have been found on this level,
            # try the next level up.
            for lane in parent_lane.child_lanes:
                if lane.index > index:
                    result = lane
                    break
        else:
            # We don't want the sibling sub-lanes in this case because
            # they are just horizontal subdivisions.
            pass

        if result is None:
            # We found no next lane at the same level as this one.
            return self._getNextLanes(
                parent_lane.parent_lane, parent_lane.index,
                parent_lane.orientation)
        else:
            # We found appropriate sibling lane, but now go as deep as we
            # can to ensure we do not end up in the "container" lane.
            child = self._getChildrenDeep(result)
            if isinstance(child, list):
                return child
            else:
                return [child]

    def getNextLanes(self):
        # If a lane has children lanes, ignore this lane.
        # Raise an exception instead?
        if len(self.child_lanes) > 0:
            return None
        else:
            return self._getNextLanes(self.parent_lane, self.index,
                                      self.orientation)


class LeankitBoard(Converter):

    attributes = ['Id', 'Title', 'Description', 'CreationDate', 'IsArchived']

    base_uri = '/Boards/'

    def __init__(self, board_dict, connector):
        super(LeankitBoard, self).__init__(board_dict)

        self.connector = connector
        self.root_lane = LeankitLane({
            'Id': 0,
            'Title': u'ROOT LANE',
            'Index': 0,
            'Orientation': 0,
            'ParentLaneId': -1,
            'Cards': [],
            }, self)
        self.lanes = {0: self.root_lane}
        self.cards = []
        self.default_cardtype = None

    def fetchDetails(self):
        self.details = self.connector.get(
            self.base_uri + str(self.id)).ReplyData[0]

        self._populateUsers(self.details['BoardUsers'])
        self._populateCardTypes(self.details['CardTypes'])
        self._populateLanes(self.details['Lanes'])

    def fetchCardDetails(self, card_id):
        resp_data = self.connector.get(
            "/board/{0}/GetCard/{1}".format(self.id, card_id)).ReplyData[0]
        card = LeankitCard (resp_data, None)
        return card

    def _populateUsers(self, user_data):
        self.users = {}
        self.users_by_id = {}
        for user_dict in user_data:
            user = LeankitUser(user_dict)
            self.users[user.user_name] = user
            self.users_by_id[user.id] = user

    def _populateLanes(self, lanes_data):
        self.root_lane.child_lanes = []
        for lane_dict in lanes_data:
            lane = LeankitLane(lane_dict, self)
            self.lanes[lane.id] = lane
        for lane_id, lane in self.lanes.items():
            if lane.id == 0:
                # Ignore the hard-coded root lane.
                continue
            else:
                lane.parent_lane = self.lanes.get(lane.parent_lane_id, None)
                lane.parent_lane.child_lanes.append(lane)
            self.cards.extend(lane.cards)
        self._sortLanes()

    def _populateCardTypes(self, cardtypes_data):
        self.cardtypes = {}
        for cardtype_dict in cardtypes_data:
            cardtype = LeankitCardType(cardtype_dict)
            self.cardtypes[cardtype.id] = cardtype
            if cardtype.is_default:
                self.default_cardtype = cardtype

        assert self.default_cardtype is not None

    def _sortLanes(self, lane=None):
        """Sorts the root lanes and lists of child lanes by their index."""
        if lane is None:
            lane = self.root_lane
        lanes = lane.child_lanes
        lanes.sort(key=operator.attrgetter('index'))
        for lane in lanes:
            self._sortLanes(lane)

    def getLane(self, lane_id):
        flat_lanes = {}
        def flatten_lane(lane):
            flat_lanes[lane.id] = lane
            for child in lane.child_lanes:
                flatten_lane(child)
        map(flatten_lane, self.root_lane.child_lanes)
        return flat_lanes[lane_id];

    def getLaneByTitle(self, title):
        if len(self.root_lane.child_lanes) > 0:
            return self._getLaneByTitle(self.root_lane, title)

    def _getLaneByTitle(self, lane, title):
        if (lane.title == title):
            return lane
        else:
            for child in lane.child_lanes:
                result = self._getLaneByTitle(child, title)
                if result != None:
                    return result
            return None

    def getLaneByPath(self, path, ignorecase=False):
        if len(self.root_lane.child_lanes) > 0:
            return self._getLaneByPath(self.root_lane, path, ignorecase)

    def _getLaneByPath(self, lane, path, ignorecase):
        if ignorecase == True:
            if lane.path.lower() == path.lower():
                return lane
        else:
            if lane.path == path:
                return lane

        for child in lane.child_lanes:
            result = self._getLaneByPath(child, path, ignorecase)
            if result != None:
                return result
        return None


    def _printLanes(self, lane, indent, include_cards=False):
        next_lane = lane.getNextLanes()
        if next_lane is None:
            next_lane = ''
        else:
            # next_lane = (' (next: any of [' +
            #              ', '.join([my_lane.path for my_lane in next_lane])
            #              + '])')
            # next_lane += ' - %d cards' % len(lane.cards)
            next_lane = ' %d cards' % len(lane.cards)
        print ("  " * indent + "* " + lane.title + next_lane)
        for card in lane.cards:
            print ("  " * (indent + 1) + "- #" + card.external_card_id +
                   ': ' + card.title
                   + ' - progress ' + str(card.task_board_completed_card_size) + ' of '+ str(card.task_board_total_size)
                   + ' - due date: ' + card.due_date)
            if (len(card.comments) > 0):
                for c in card.comments:
                    print (c.post_date + ' - ' + c.text)
        for child in lane.child_lanes:
            self._printLanes(child, indent + 1)

    def printLanes(self, include_cards=False, printOnlyMasterlane=''):
        """Recursively prints all the lanes in the board with indentation."""
        if len(self.root_lane.child_lanes) == 0:
            return
        print ("Board lanes:")
        indent = 1
        for lane in self.root_lane.child_lanes:
            if (printOnlyMasterlane == '' or lane.title == printOnlyMasterlane):
                self._printLanes(lane, indent, include_cards)


class LeankitKanban(object):

    def __init__(self, account, username=None, password=None):
        self.connector = LeankitConnector(account, username, password)
        self._boards = []
        self._boards_by_id = {}
        self._boards_by_title = {}

    def getBoards(self, include_archived=False):
        boards_data = self.connector.get('/Boards').ReplyData
        boards = []
        for board_dict in boards_data[0]:
            board = LeankitBoard(board_dict, self.connector)
            if board.is_archived and not include_archived:
                continue
            boards.append(board)
        return boards

    def _refreshBoardsCache(self):
        self._boards = self.getBoards(True)
        self._boards_by_id = {}
        self._boards_by_title = {}
        for board in self._boards:
            self._boards_by_id[board.id] = board
            self._boards_by_title[board.title] = board

    def _findBoardInCache(self, board_id=None, title=None):
        assert title is not None or board_id is not None, (
            "Either a board title or board id are required.")
        if board_id is not None and board_id in self._boards_by_id:
            return self._boards_by_id[board_id]
        elif title in self._boards_by_title:
            return self._boards_by_title[title]
        else:
            return None

    def _findBoard(self, board_id=None, title=None):
        board = self._findBoardInCache(board_id, title)
        if board is None:
            # Not found, try once more after refreshing the cache.
            self._refreshBoardsCache()
            board = self._findBoardInCache(board_id, title)
        return board

    def getBoard(self, board_id=None, title=None):
        board = self._findBoard(board_id, title)
        if board is not None:
            board.fetchDetails()
        return board


    def getSingleCard(self, board_id=None, board_title=None, card_id=None):
        board = self._findBoard(board_id, board_title)
        card = None
        if board is not None:
            card = board.fetchCardDetails(card_id)
        return card


if __name__ == '__main__':
    print("Starting script")
    print(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    # init mongo
    # _initMongoConn ()

    # parse arguments
    parser = argparse.ArgumentParser(description='Synchronize with LeanKit account.')
    parser.add_argument('-b', '--board', help='board (id) to be synchronized', type=int)
    parser.add_argument('-c', '--comments', help='fetch comments', default=False)
    args = parser.parse_args()

    if args.board is not None and args.comments is not None:
        # init kanban
        kanban = LeankitKanban('dreamlab', 'joanna.grzywna@grupaonet.pl',
                                           'piotrek2003')

        print("Getting board '%s'..." % args.board)
        board = kanban.getBoard(board_id=args.board)

        if board is not None:
            print(board.id, board.title)
            print(len(board.cards))
            for card in board.cards:
                print (card.title)
                card.fetchComments()
            # _cleanBoard(args.board)
            # _insertAllCardsForBoard(board.root_lane.child_lanes, '')
            # _insertParamInfo("last_leankit_synchro")

    print("Ending script")
    print(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    exit(0)


    # kanban = LeankitKanban('dreamlab',
    #                        'joanna.grzywna@grupaonet.pl', 'piotrek2003')
    #
    # boards = kanban.getBoards()
    # for board in boards:
    #     print(board.title, board.id)
        # if board.title == 'PMO Portfolio Kanban Teams':
        #     card = board.fetchCardDetails("275535052")

    # Get a board by the title.
    # board_name = 'PMO Portfolio Kanban Teams'
    # print ("Getting board '%s'..." % board_name)
    # board = kanban.getBoard(title=board_name)
    # board.printLanes(True, "Current development plan")
    # board.generateReport(report, "Current development plan")

    # Print all users.
    # print (board.users)

