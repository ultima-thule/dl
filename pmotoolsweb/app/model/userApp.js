// app/models/board.js
var mongoose = require('mongoose');

var jiraBoardSchema = new mongoose.Schema(
    {
        boardid: Number,
        name: String
    }
);

var userAppSchema = new mongoose.Schema(
    {
        upn: {type : String , required : true},
        avatar: String,
        token: String,
        last_login: Date,
        roles: [String],
        jiraBoards: [jiraBoardSchema]
    }
);

module.exports = mongoose.model('userApp', userAppSchema, 'userApp');
