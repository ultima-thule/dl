// app/models/sponsor.js
var mongoose = require('mongoose');

// define our sponsor model
// module.exports allows us to pass this to other files when it is called

var sponsorSchema = new mongoose.Schema(
    {
        name : {type : String , required : true },
        bo_name: {type : String , required : true },
        tag: {type : String , unique : true, required : true, dropDups: true }
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('sponsor', sponsorSchema, 'sponsor');

