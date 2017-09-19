// app/models/card.js
var mongoose = require('mongoose');

// define our team  model
// module.exports allows us to pass this to other files when it is called

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

var commentSchema = new mongoose.Schema(
    {
        comment_id: Number,
        text: String,
        post_date: Date,
        posted_by_id: Number,
        posted_by_full_name: String
    }
);

var quarterPlanSchema = new mongoose.Schema(
{
    card_id: Number,
    active: Boolean,
    assigned_user_id: Number,
    assigned_user_ids: [Number],
    assigned_user_name: String,
    attachments_count: Number,
    block_reason: String,
    block_state_change_date: Date,
    class_of_service_id: Number,
    class_of_service_title : String,
    comments: [commentSchema],
    comments_count: Number,
    current_taskboard_id: Number,
    create_date: Date,
    date_archived: Date,
    description : String,
    due_date: Date,
    external_card_id : String,
    external_system_name : String,
    external_system_url : String,
    index: Number,
    is_blocked: Boolean,
    lane_id: Number,
    last_activity: Date,
    last_comment: Date,
    last_move: Date,
    parent_card_id: Number,
    priority: Number,
    priority_text : String,
    size: Number,
    start_date: Date,
    tags: [String],
    taskboard_completed_card_count: Number,
    taskboard_completed_card_size: Number,
    taskboard_completion_percent: Number,
    taskboard_total_cards: Number,
    taskboard_total_size: Number,
    title : String,
    type_id: Number,
    type_name : String,
    version: Number,
    board_id: Number,
    board_title : String,
    board_masterlane_id: Number,
    board_masterlane_title : String,

    team_name : String,
    workflow_status_name : String,

    extended_data: {
        sponsor_name: String,
        category_name: String,
        initiative_type_name: String,
        budget_status_name: String,
        release_status_name: String,
        year_quarter: String
    }
},
{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});


module.exports = mongoose.model('quarterPlan', quarterPlanSchema, 'quarterPlan');

