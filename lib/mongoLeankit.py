__author__ = 'asia grzywna'

from mongoengine import *

class Board(Document):
    board_id = LongField(primary_key=True)
    title = StringField()
    is_archived = BooleanField()
    creation_date = DateTimeField()


class User(Document):
    email = StringField()
    full_name = StringField()
    enabled = BooleanField()
    user_id = LongField(primary_key=True)
    role = IntField()
    role_name = StringField()
    user_name = StringField()
    board_id = LongField()


class Comment (EmbeddedDocument):
    comment_id = LongField(primary_key=True)
    text = StringField()
    post_date = DateTimeField()
    posted_by_id = LongField ()
    posted_by_full_name = StringField()


class Sponsor(Document):
    sponsor_id = LongField(primary_key=True)
    name = StringField()
    bo_name = StringField()


class CardExtend(EmbeddedDocument):
    sponsor_name = StringField()
    sponsor_ref = ReferenceField(Sponsor)

    budget_status_name = StringField()
    release_status_name = StringField()
    category_name = StringField() # IT platform, business
    initiative_type_name = StringField() # NBV, Improvement, BAU, Support


class Card(Document):
    card_id = LongField(primary_key=True)

    active = BooleanField()
    #actual_start_date = DateTimeField()
    #actual_finish_date = DateTimeField()
    assigned_user_id = LongField()
    assigned_user_ids = ListField(LongField())
    assigned_user_name = StringField()
    #assigned_users = ListField(ReferenceField(User))
    attachments_count = IntField()
    block_reason = StringField()
    block_state_change_date = DateTimeField()
    # card_contexts, card_drill_through_board_ids, card_drill_through_boards, card_type_icon_color, card_type_icon_name
    # class_of_service_color_hex, class_of_service_custom_icon_color, class_of_service_custom_icon_name, class_of_service_custom_icon_path
    class_of_service_id = LongField()
    class_of_service_title = StringField()
    # color
    comments = SortedListField(EmbeddedDocumentField(Comment), ordering="post_date", reverse=True)
    comments_count = IntField()
    # count_of_old_cards, current_context
    current_taskboard_id = LongField()
    create_date = DateTimeField()
    date_archived = DateTimeField()
    description = StringField()
    # drill_through...
    due_date = DateTimeField()
    external_card_id = StringField()
    external_system_name = StringField()
    external_system_url = StringField()
    # gravatar_link
    # external_card_id_prefix = StringField()
    # has_drillthrough_board, has_multiple_drillthrough_boards
    index = IntField()
    is_blocked = BooleanField()
    lane_id = LongField()
    #lane_title = StringField()
    last_activity = DateTimeField()
    # last_attachment
    last_comment = DateTimeField()
    last_move = DateTimeField()
    #parent_board_id = LongField()
    parent_card_id = LongField()
    #parent_taskboard_id = LongField()
    priority = IntField()
    priority_text = StringField()
    size = IntField()
    # small_gravatar_link
    start_date = DateTimeField()
    # system_type = StringField()
    tags = ListField(StringField())
    taskboard_completed_card_count = IntField()
    taskboard_completed_card_size = IntField()
    taskboard_completion_percent = IntField()
    taskboard_total_cards = IntField()
    taskboard_total_size = IntField()
    title = StringField()
    # type, type_color_hex, type_icon_path,
    type_id =  IntField()
    type_name = StringField()
    version = IntField()

    # additional fields for board aggregation
    board_id = LongField()
    board_title = StringField()
    board_masterlane_id = LongField()
    board_masterlane_title = StringField()

    # additional fields for team
    team_name = StringField()
    workflow_status_name = StringField()

    extended_data = EmbeddedDocumentField(CardExtend)




class Team(Document):
    name = StringField(primary_key=True)
    location_name = StringField()
    sponsor_ref = ReferenceField(Sponsor)
    default_category_name = StringField() # IT platform, business
    pmo_name = StringField ()# PMO1, PMO2


class MasterLane(Document):
    lane_id = LongField(primary_key=True)
    title = StringField()
    index = IntField()
    lane_type = IntField()
    board_id = LongField()


class SystemSettings(Document):
    setting_key = StringField(primary_key=True)
    setting_value = StringField()