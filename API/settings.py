__author__ = 'asia'

MONGO_HOST = 'localhost'
MONGO_PORT = 27017
MONGO_DBNAME = 'leankit'

card = {
    'schema': {
        'card_id': {'type': 'integer'},
        'active': {'type': 'boolean'},
        'assigned_user_id': {'type': 'integer'},
        'assigned_user_ids': {'type': 'list'},
        'assigned_user_name': {'type': 'string'},
        'attachments_count': {'type': 'integer'},
        'block_reason': {'type': 'string'},
        'block_state_change_date': {'type': 'datetime'},
        'class_of_service_id': {'type': 'integer'},
        'class_of_service_title': {'type': 'string'},
        'comments': {'type': 'list'},
        'comments_count': {'type': 'integer'},
        'create_date': {'type': 'datetime'},
        'current_taskboard_id': {'type': 'integer'},
        'date_archived': {'type': 'datetime'},
        'description' : {'type': 'string'},
        'due_date' : {'type': 'datetime'},
        'external_system_name' : {'type': 'string'},
        'external_system_url' : {'type': 'string'},
        'external_card_id' : {'type': 'string'},
        'index' : {'type': 'integer'},
        'is_blocked': {'type': 'boolean'},
        'lane_id': {'type': 'integer'},
        'last_activity': {'type': 'datetime'},
        'last_comment': {'type': 'datetime'},
        'last_move': {'type': 'datetime'},
        'parent_card_id': {'type': 'integer'},
        'priority': {'type': 'integer'},
        'priority_text': {'type': 'string'},
        'size': {'type': 'integer'},
        'start_date': {'type': 'datetime'},
        'tags': {'type': 'list'},
         'taskboard_completed_card_count': {'type': 'integer'},
        'taskboard_completed_card_size': {'type': 'integer'},
        'taskboard_completion_percent': {'type': 'integer'},
        'taskboard_total_cards': {'type': 'integer'},
        'taskboard_total_size': {'type': 'integer'},
        'title': {'type': 'string'},
        'type_id': {'type': 'integer'},
        'type_name': {'type': 'string'},
        'version': {'type': 'integer'},
        'board_id': {'type': 'integer'},
        'board_title': {'type': 'integer'},
        'board_masterlane_id': {'type': 'integer'},
        'board_masterlane_title': {'type': 'string'},
        'team_name': {'type': 'string'},
        'status_name': {'type': 'string'}
    }
}

team = {
    'schema': {
        'team_id': {'type': 'integer'},
        'name': {'type': 'boolean'},
        'location_name': {'type': 'boolean'},
        'type_name': {'type': 'string'},
        'pmo_name': {'type': 'boolean'}
        # 'sponsor_ref': {
        #      'type': 'objectid',
        #      'data_relation': {
        #          'resource': 'sponsor',
        #          'field': '_id',
        #          'embeddable': True
        #      }
        #  }
    }
}

DOMAIN = {
    'card': card,
    'team': team
}

RESOURCE_METHODS = ['GET']
ITEM_METHODS = ['GET']
XML = False