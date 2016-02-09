// app/models/board.js
var mongoose = require('mongoose');

var userAppSchema = new mongoose.Schema(
    {
        upn: {type : String , required : true},
        avatar: String,
        token: String,
        last_login: Date,
        roles: [String]
    }
);

module.exports = mongoose.model('userApp', userAppSchema, 'userApp');
