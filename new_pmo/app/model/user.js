// app/models/user.js
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema(
    {
        email: String,
        full_name: String,
        enabled: Boolean,
        user_id: Number,
        role: Number,
        role_name: String,
        user_name: String,
        board_id: Number,
        is_coordinator: Boolean
    }
);

module.exports = mongoose.model('user', userSchema, 'user');
