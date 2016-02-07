// app/models/board.js
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema(
    {
        exampleId: Number
    }
);

module.exports = mongoose.model('userOauth', userSchema, 'userOauth');
