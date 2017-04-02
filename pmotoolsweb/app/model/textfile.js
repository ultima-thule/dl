// app/models/pwfile.js
var mongoose = require('mongoose');

// define our team  model
// module.exports allows us to pass this to other files when it is called

module.exports = mongoose.model('textfile', {
    data : String,
    project: String,
    generation_date: Date,
    date_text: String,
    format_type: String
}, 'textfile');