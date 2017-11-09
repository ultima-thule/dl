// app/models/configparam.js
var mongoose = require('mongoose');

// define our team  model
// module.exports allows us to pass this to other files when it is called

var paramSchema = new mongoose.Schema(
    {
        param_key : {type : String},
        param_description: {type : String},
        param_value_date: {type : Date},
        param_value_string: {type : String}
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('configparam', paramSchema, 'configparam');