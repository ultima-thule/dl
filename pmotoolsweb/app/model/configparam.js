// app/models/configparam.js
var mongoose = require('mongoose');

// define our team  model
// module.exports allows us to pass this to other files when it is called

module.exports = mongoose.model('configparam', {
    param_key : String,
    param_value_date: Date,
    param_value_string: String
}, 'configparam');