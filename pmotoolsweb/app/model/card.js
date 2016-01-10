// app/models/card.js
var mongoose = require('mongoose');

// define our team  model
// module.exports allows us to pass this to other files when it is called

module.exports = mongoose.model('card', {
    title : String,
    workflow_status_name: String,
    team_name: String,
    extended_data: {
        sponsor_name: String,
        category_name: String,
        initiative_type_name: String
    }

}, 'card');