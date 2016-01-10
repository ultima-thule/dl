// app/models/sponsor.js
var mongoose = require('mongoose');

// define our sponsor model
// module.exports allows us to pass this to other files when it is called

var Schema = mongoose.Schema;

var sponsorSchema = new Schema({
    name : String,
    bo_name: String,
    default_team: ObjectId,
    default_team_name: String
});a

module.exports = mongoose.model('Sponsor', sponsorSchema);