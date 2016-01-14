 // app/routes.js

// grab the card model we just created
var Team = require('./model/team');
var Report = require('./model/report');
var ConfigParam = require('./model/configparam');
var Card = require('./model/card');
var Sponsor = require('./model/sponsor');
var LeanKitClient  = require("leankit-client");

module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // team api route
    app.get('/api/teams', function(req, res) {
        // use mongoose to get all teams in the database
        Team.find(function(err, teams) {

            console.log("teams")
            console.log(teams)
            // if there is an error retrieving, send the error.
                            // nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(teams); // return all teams in JSON format
        });
    });


    // create team and send back all teams after creation
    app.post('/api/teams', function(req, res) {

        // create a team, information comes from AJAX request from Angular
        Team.create({
            name : req.body.text,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the teams after you create another
            Team.find(function(err, teams) {
                if (err)
                    res.send(err)
                res.json(teams);
            });
        });

    });

    // delete a team
    app.delete('/api/teams/:team_id', function(req, res) {
        Team.remove({
            _id : req.params.team_id
        }, function(err, team) {
            if (err)
                res.send(err);

            // get and return all the teams after you create another
            Team.find(function(err, teams) {
                if (err)
                    res.send(err)
                res.json(teams);
            });
        });
    });

    // get a report
    app.get('/api/reports/:id', function(req, res) {
        Report.find({_id: req.params.id}, function(err, reports) {
            console.log("id")
            console.log(req.params.id)
            if (err)
                res.send(err);
            var date = reports[0].generation_date.toISOString().replace(/T/, ' ').replace(/\..+/, '')
            res.append('Content-Disposition', 'attachment; filename=report_' + date + '.xlsx');
            res.append('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            console.log("File report was requested");
            res.send(reports[0].xls_data);
          });
    });


    // report api route
    app.get('/api/reports', function(req, res) {
        // use mongoose to get all teams in the database
        Report.find({}).sort('-generation_date').exec (function(err, reports) {

            console.log("get report")
            console.log(reports)
            // if there is an error retrieving, send the error.
                            // nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(reports); // return all teams in JSON format
        });
    });


    // generate new report
    app.get('/api/genreport', function(req, res) {

        //var python = require('child_process').spawn('/usr/bin/python3.4', ['/home/asia/git/dl/pmotoolsweb/public/python/py_gen.py']);
        var python = require('child_process').spawn('C://python34//python.exe', ["C://Users//jgrzywna//PycharmProjects//dl//pmotoolsweb//public//python//py_gen.py"]);


        var output = "";
        python.stdout.on('data', function(){ output += data });
        python.on('close', function(code)
        {
            if (code !== 0) {  return res.send(500, code); }
            return res.send(200, output)
        });
    });

    // get a config param
    app.get('/api/configparams/:id', function(req, res) {
        ConfigParam.find({param_key: req.params.id}, function(err, configparams) {
            if (err)
                res.send(err);
            res.json (configparams);
          });
    });


    // initiative api route
    app.get('/api/cards', function(req, res) {
        // use mongoose to get all teams in the database
        Card.find({board_masterlane_title: "Current development plan"}, function(err, cards) {

            // if there is an error retrieving, send the error.
            // nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(cards); // return all teams in JSON format
        });
    });

    // sponsor api route
    app.get('/api/sponsors', function(req, res) {
        // use mongoose to get all sponsors in the database
        Sponsor.find(function(err, sponsors) {

            console.log("sponsors")
            console.log(sponsors)
            // if there is an error retrieving, send the error.
                            // nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(sponsors); // return all teams in JSON format
        });
    });

    // synchro api route
    app.get('/api/synchro', function(req, res) {
        var accountName = "dreamlab";
        var email = "joanna.grzywna@grupaonet.pl";
        var password = "piotrek2003";
        var LeanKitClient = require( "leankit-client" );
        var client = new LeanKitClient(accountName, email, password);
        client.getBoard(249156903( function( err, boards ) {
	console.log( boards );
} );

        res.send("OK");
    });

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};
