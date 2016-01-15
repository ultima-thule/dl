__author__ = 'asia'

import lib.leankit
from lib.mongoLeankit import *
from mongoengine import *
import datetime

globalTeamDict = {}

def _initMongoConn ():
    connect('leankit')

def _insertBoards (boards):
    for board in boards:
        b = lib.mongoLeankit.Board()

        b.board_id = board.id
        b.title = board.title
        b.is_archived = board.is_archived
        b.creation_date = datetime.datetime.strptime(board.creation_date, '%Y/%m/%d')

        b.save()

def _insertUsers (users, board_id):
    for k, v in users.items():
        u = lib.mongoLeankit.User()

        u.user_id = v.id
        u.email = v.email_address
        u.enabled = v.enabled
        u.full_name = v.full_name
        u.role = v.role
        u.role_name = v.role_name
        u.user_name = v.user_name
        u.board_id = board_id

        u.save()

def _insertMasterLanes(lanes, board_id):
    for lane in lanes:
        l = lib.mongoLeankit.MasterLane()

        l.lane_id = lane.id
        l.title = lane.title
        l.index = lane.index
        l.lane_type = lane.type
        l.board_id = board_id

        l.save()


def _insertAllCardsForBoard(master_lanes, only_this_lane=''):
    for lane in master_lanes:
        if only_this_lane == '' or lane.title == only_this_lane:
            _insertCardsForLane(lane)


def _insertCardsForLane(lane):
    if len(lane.cards) > 0:
        # next_lane = lane.getNextLanes()
        # parent_lane_title = ''
        # parent_lane_id = None
        # if next_lane is not None:
        #     parent_lane_title = lane.parent_lane.title
        #     parent_lane_id = lane.parent_lane.id
        for card in lane.cards:
            c = _insertCard(card, lane)
    for child in lane.child_lanes:
        _insertCardsForLane(child)


def _getCorrectDate (date_str, is_long=False, is_long_with_at=False):
    if date_str is None or date_str == '':
        return None

    date_format = '%Y/%m/%d'
    if is_long is True:
        date_format = '%Y/%m/%d %H:%M:%S %p'
    if is_long_with_at is True:
        date_format = '%Y/%m/%d at %H:%M:%S %p'

    return datetime.datetime.strptime(date_str, date_format)


def _createCardExtend(card):
    c = lib.mongoLeankit.CardExtend()

    # c.card_extend_id = card.id
    # c.card_ref = card
    # c.sponsor_name = StringField()
    # c.sponsor_ref = ReferenceField(Sponsor)

    #new fields for report
    c.budget_status_name = _getBudgetStatusName(card.taskboard_completed_card_size, card.taskboard_total_size)
    c.release_status_name = _getReleaseStatusName(card.workflow_status_name, card.due_date)
    c.sponsor_name = _getSponsorName(card.tags)
    c.category_name = "not set"
    c.initiative_type_name = "not set"

    return c


def _updateCardExtendFromCard(card):
    ce = CardExtend.objects(_id=card.id).update(upsert=True, new=True,
                                    card_extend_id = card.id,
                                    budget_status_name = _getBudgetStatusName(card.taskboard_completed_card_size, card.taskboard_total_size),
                                    release_status_name = _getReleaseStatusName(card.workflow_status_name, card.due_date))

    return ce


def _insertCard(card, lane):
    c = lib.mongoLeankit.Card()

    c.card_id = card.id

    c.active = card.active
    c.assigned_user_id = card.assigned_user_id
    c.assigned_user_ids = card.assigned_user_ids
    c.assigned_user_name = card.assigned_user_name
    # c.assigned_users = card.
    c.attachments_count = card.attachments_count
    c.block_reason = card.block_reason
    c.block_state_change_date = _getCorrectDate(card.block_state_change_date)
    c.class_of_service_id = card.class_of_service_id
    c.class_of_service_title = card.class_of_service_title
    c.comments_count = card.comments_count
    c.current_taskboard_id = card.current_task_board_id
    c.create_date = _getCorrectDate(card.create_date)
    c.date_archived = _getCorrectDate(card.date_archived)
    c.description = card.description
    c.due_date = _getCorrectDate(card.due_date)
    c.external_card_id = card.external_card_id
    c.external_system_name = card.external_system_name
    c.external_system_url = card.external_system_url
    c.index = card.index
    c.is_blocked = card.is_blocked
    c.lane_id = card.lane_id
    c.last_activity = _getCorrectDate(card.last_activity, True)
    c.last_comment = _getCorrectDate(card.last_comment)
    c.last_move = _getCorrectDate(card.last_move, True)
    c.parent_card_id = card.parent_card_id
    c.priority = card.priority
    c.priority_text = card.priority_text
    c.size = card.size
    c.start_date = _getCorrectDate(card.start_date)
    c.tags = [t for t in card.tags.split(',')]
    c.taskboard_completed_card_count = card.task_board_completed_card_count
    c.taskboard_completed_card_size = card.task_board_completed_card_size
    c.taskboard_completion_percent = card.task_board_completion_percent
    c.taskboard_total_cards = card.task_board_total_cards
    c.taskboard_total_size = card.task_board_total_size
    c.title = card.title
    c.type_id = card.type_id
    c.type_name = card.type_name
    c.version = card.version
    #additional fields for board aggregation
    c.board_id = lane.board.id
    c.board_title = lane.board.title
    c.board_masterlane_id = lane.parent_lane.parent_lane.parent_lane.id
    c.board_masterlane_title = lane.parent_lane.parent_lane.parent_lane.title

    #additional fields for team aggregation
    c.team_name = lane.parent_lane.title
    c.workflow_status_name = lane.title

    if len(card.comments) > 0:
        comm_list = []
        for comment in card.comments:
            nc = lib.mongoLeankit.Comment()
            nc.comment_id = comment.id
            nc.post_date = _getCorrectDate (comment.post_date, False, True)
            nc.posted_by_full_name = comment.posted_by_full_name
            nc.posted_by_id = comment.posted_by_id
            nc.text = comment.text
            comm_list.append(nc)
        c.comments = comm_list

    c.extended_data = _createCardExtend(c)

    c.save()
    return c


def _getBudgetStatusName(done, planned):
    if done is None or planned is None:
        return "in budget"
    if done <= planned:
        return "in budget"
    return "budget exceeded"


def _getReleaseStatusName(workflow_step, due_date):
    if workflow_step == "Recently Done":
        return "released"
    if workflow_step == "Todo" or (due_date is not None and due_date + datetime.timedelta(days=10) >= datetime.datetime.today()):
        return "in plan"
    return "term exceeded"

def _getSponsorName(tags):
    if tags is None or len(tags) == 0:
        return ""
    tagBo = [x for x in tags if str(x).startswith("BO_")]
    if len(tagBo) > 0:
        return tagBo[0]
    return ""


def _insertTeam(lane):
    t = lib.mongoLeankit.Team()

    t.name = lane.title
    t.location = lane.parent_lane.title

    t.save()

def _insertAllTeamsForBoard(board):
    global globalTeamDict
    globalTeamDict = {}

    teams = lib.mongoLeankit.Team.objects().order_by('location', 'name')
    for team in teams:
        globalTeamDict[team.name] = True

    for master_lane in board.root_lane.child_lanes:
        print ("Analysin master lane " + master_lane.title)
        for loc_lane in master_lane.child_lanes:
            print ("  Analysin loc lane " + loc_lane.title)
            for team_lane in loc_lane.child_lanes:
                print ("    Analysin team lane " + team_lane.title)
                if team_lane.title not in globalTeamDict:
                    _insertTeam(team_lane)
                    globalTeamDict[team_lane.title] = True


if __name__ == '__main__':
    _initMongoConn ()

    kanban = lib.leankit.LeankitKanban('dreamlab',
                           'joanna.grzywna@grupaonet.pl', 'piotrek2003')

    # boards = kanban.getBoards()
    # for board in boards:
    #     print(board.hasUpdates())
        # if board.title == 'PMO Portfolio Kanban Teams':
        #     card = board.fetchCardDetails("275535052")
        #     if card is not None:
        #         _createOrUpdateCard(card)


    print("Active boards:")
    # boards = kanban.getBoards()
    # _insertBoards(boards)
    #
    # Get a board by the title.
    board_name = 'PMO Portfolio Kanban Teams'
    print("Getting board '%s'..." % board_name)
    board = kanban.getBoard(title=board_name)
    # _insertMasterLanes(board.root_lane.child_lanes, board.id)
    _insertAllCardsForBoard(board.root_lane.child_lanes, '')
    # _insertAllTeamsForBoard(board)
    # board.printLanes(True, "Current development plan")
    # board.generateReport(report, "Current development plan")

    # Print all users.
    # _insertUsers(board.users, board.id)


