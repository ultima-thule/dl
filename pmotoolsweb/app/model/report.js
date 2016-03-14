// app/models/report.js
var mongoose = require('mongoose');

// define our team  model
// module.exports allows us to pass this to other files when it is called

module.exports = mongoose.model('report', {
    xls_data : Buffer,
    generation_date: Date,
    is_plan: Boolean
}, 'report');