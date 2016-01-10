// app/models/team.js
var mongoose = require('mongoose');

// define our team  model
// module.exports allows us to pass this to other files when it is called

module.exports = mongoose.model('team', {
    name : String,
    location: String,
    default_category: String,
    pmo: String
}, 'team');