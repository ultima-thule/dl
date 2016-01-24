// app/models/board.js
var mongoose = require('mongoose');

var boardSchema = new mongoose.Schema(
    {
        board_id: Number,
        title: String,
        description: String,
        is_archived: Boolean,
        creation_date: Date,
        is_current: {type: Boolean, default: false}
    }
);

module.exports = mongoose.model('board', boardSchema, 'board');
