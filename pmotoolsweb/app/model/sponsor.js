// app/models/sponsor.js
var mongoose = require('mongoose');

// define our sponsor model
// module.exports allows us to pass this to other files when it is called

module.exports = mongoose.model('sponsor', {
    name : String,
    bo_name: String,
    tag: String
}, 'sponsor');

