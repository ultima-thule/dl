var Board = require('./app/model/board');
var LeanKitClient = require( "leankit-client" );
var mongoose       = require('mongoose');

var client = new LeanKitClient( "dreamlab", "joanna.grzywna@grupaonet.pl", "piotrek2003" );

var db = require('./config/db');
mongoose.connect(db.url);

//process.on('SIGINT', function() {
//  mongoose.connection.close(function () {
//    console.log('Mongoose default connection disconnected through app termination');
//    process.exit(0);
//  });
//});

var searchOptions = {
    SearchTerm: "",
    SearchInBacklog: false,
    SearchInBoard: true,
    SearchInRecentArchive: false,
    SearchInOldArchive: false,
    IncludeComments: false,
    IncludeTags: false,
    Page: 1,
    MaxResults: 20
};

client.searchCards( boardId, searchOptions, function( err, response ) {
    if ( err ) console.error( "Error searching cards:", err );
    console.log( response.Results );
    console.log( "Total Results:", response.TotalResults );
} );

client.getBoards(function (err, boards) {
    if (err) console.error ("Error getting board: ", err);
    console.log (boards);
});
//
//function refreshBoards(boards)
//{
//    for (i in boards) {
//            Board.findOneAndUpdate({board_id : boards[i].Id}, {$set: boards[i]}, {upsert: true, new: true}, function(err, board) {
//        });
//    };
//};
//
//function synchroError(err) {
//    console.log( "ERR:", err );
//};
//
