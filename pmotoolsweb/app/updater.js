 // app/updater.js

var LeanKitClient  = require("leankit-client");
var mongoose       = require('mongoose');

function synchroBoards() {
    var client = new LeanKitClient  ("dreamlab", "joanna.grzywna@grupaonet.pl", "piotrek2003");
    client.getBoards(function(err, boards) {
        console.log(boards);
    } );
}
