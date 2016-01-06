__author__ = 'asia'

MONGO_HOST = 'localhost'
MONGO_PORT = 27017
MONGO_DBNAME = 'leankit'
MONGO_USERNAME = 'leankit'
MONGO_PASSWORD = 'gk6tnmcj?!'

DOMAIN = {
    'card': {
        'schema': {
            'board_id': {
                'type': 'string'
                },
            'board_title': {
                'type': 'string'
                },
            'lane_id': {
                'type': 'string'
            },
            'lane_title': {
                'type': 'string'
            },
            'title': {
                'type': 'string'
            },
            'description': {
                'type': 'string'
            },
            'card_type': {
                'type': 'string'
            },
            'priority': {
                'type': 'integer'
            },
            'priority_text': {
                'type': 'string'
            },
            'type_name': {
                'type': 'string'
            },
            'size': {
                'type': 'integer'
            },
            'active': {
                'type': 'boolean'
            },
            'version': {
                'type': 'integer'
            },
            'assigned_users': {
                'type': 'list'
            },
            'is_blocked': {
                'type': 'boolean'
            },
            'block_reason': {
                'type': 'string'
            },
            'block_state_change_date': {
                'type': 'datetime'
            },
            'index': {
                'type': 'integer'
            },
            'start_date': {
                'type': 'datetime'
            },
            'due_date': {
                'type': 'datetime'
            },
            'external_system_name': {
                'type': 'string'
            },
            'external_system_url': {
                'type': 'string'
            },
            'ExternalCardID': {
                'type': 'string'
            },
            'external_card_id_prefix': {
                'type': 'string'
            },
            'tags': {
                'type': 'string'
            },
            'parent_board_id': {
                'type': 'string'
            },
            'parent_taskboard_id': {
                'type': 'string'
            },
            'last_move': {
                'type': 'datetime'
            },
            'last_activity': {
                'type': 'datetime'
            },
            'date_archived': {
                'type': 'datetime'
            },
            'comments_count': {
                'type': 'integer'
            },
            'last_comment': {
                'type': 'datetime'
            },
            'attachments_count': {
                'type': 'integer'
            },
            'create_date': {
                'type': 'datetime'
            },
            'actual_start_date': {
                'type': 'datetime'
            },
            'actual_finish_date': {
                'type': 'datetime'
            },
            'assigned_user_name': {
                'type': 'string'
            },
            'assigned_user_id': {
                'type': 'string'
            },
            'assigned_user_ids': {
                'type': 'list'
            },
            'class_of_service_id': {
                'type': 'string'
            },
            'class_of_service_title': {
                'type': 'string'
            },
            'current_taskboard_id': {
                'type': 'string'
            }
            'taskboard_completion_percent': {
                'type': 'integer'
            },
             'taskboard_completed_card_count': {
                'type': 'integer'
            },
            'taskboard_completed_card_size': {
                'type': 'integer'
            },
            'taskboard_total_cards': {
                'type': 'integer'
            },
            'taskboard_total_size': {
                'type': 'integer'
            },
            'parent_card_id': {
                'type': 'string'
            }
        }
    }
}

RESOURCE_METHODS = ['GET', 'POST']