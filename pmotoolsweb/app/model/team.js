// app/models/team.js
var mongoose = require('mongoose');

// define our team  model
// module.exports allows us to pass this to other files when it is called

module.exports = mongoose.model('team', {
    name : {type : String , required : true},
    location: String,
    default_category: String,
    pmo: String,
    pmoBoss: String,
    sponsor_name: String,
    coordinator: String,
    sm: String,
    capacity: Number,
    ignore: {type: Boolean, default: false},
    no_of_developers: Number
}, 'team');