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

    // =========================== TEAM ================================

    // get all teams
    app.get('/api/teams', function(req, res) {
        Team.find(function(err, teams) {
            if (err)
                res.send(err);
            res.json(teams);
        });
    });

    // get a single team
    app.get('/api/teams/:id', function(req, res) {
        Team.findOne({_id : req.params.id}, function(err, team) {
            if (err)
                res.send(err);
            res.json(team);
        });
    });

    // update a single team
    app.put('/api/teams/:id', function(req, res) {
        Team.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, function (err, team) {
            res.send(team);
        });
    });

    // =========================== REPORT ================================

    // get a report in excel format
    app.get('/api/reports/:id', function(req, res) {
        Report.find({_id: req.params.id}, function(err, reports) {
            if (err)
                res.send(err);
            var date = reports[0].generation_date.toISOString().replace(/T/, ' ').replace(/\..+/, '')
            res.append('Content-Disposition', 'attachment; filename=report_' + date + '.xlsx');
            res.append('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(reports[0].xls_data);
          });
    });

    // gel all reports
    app.get('/api/reports', function(req, res) {
        // use mongoose to get all teams in the database
        Report.find({}).sort('-generation_date').exec (function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });
    });


    // generate new report with python script
    app.get('/api/genreport', function(req, res) {

        var python = require('child_process').spawn('/usr/bin/python3.4', ['/home/httpd/dl/pmotoolsweb/public/python/py_gen.py']);
        //var python = require('child_process').spawn('C://python34//python.exe', ["C://Users//jgrzywna//PycharmProjects//dl//pmotoolsweb//public//python//py_gen.py"]);

        var output = "";
        python.stdout.on('data', function(){ output += data });
        python.on('close', function(code)
        {
            if (code !== 0) {  return res.send(500, code); }
            return res.send(200, output)
        });
    });

    // =========================== CONFIG ================================

    // get a single config param
    app.get('/api/configparams/:id', function(req, res) {
        ConfigParam.find({param_key: req.params.id}, function(err, configparams) {
            if (err)
                res.send(err);
            res.json (configparams);
          });
    });

    // =========================== CARD ================================

    // get all initiatives
    app.get('/api/cards', function(req, res) {
        // use mongoose to get all teams in the database
        Card.find({board_masterlane_title: "Current development plan"}, function(err, cards) {
            if (err)
                res.send(err);
            res.json(cards);
        });
    });

    // =========================== SPONSOR ================================

    // get all sponsors
    app.get('/api/sponsors', function(req, res) {
        Sponsor.find(function(err, sponsors) {
            if (err)
                res.send(err);
            res.json(sponsors);
        });
    });

    // create new sponsor
    app.post('/api/sponsors', function(req, res) {
        Sponsor.create(req.body, function (err, small) {
            if (err)
                res.send(err);
            res.send(200);
        })
    });

    // update a single sponsor
    app.put('/api/sponsors/:id', function(req, res) {
        Sponsor.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, function (err, sponsor) {
            res.send(sponsor);
        });
    });

    // delete a single sponsor
    app.delete('/api/sponsors/:id', function(req, res) {
        Sponsor.remove({_id: req.params.id}, function (err) {
            res.send(200);
        });
    });


    // =========================== LEANKIT SYNCHRONIZATION ================================

    // synchro api route
    app.get('/api/synchro', function(req, res) {
        var accountName = "dreamlab";
        var email = "joanna.grzywna@grupaonet.pl";
        var password = "piotrek2003";
        var LeanKitClient = require( "leankit-client" );
        var client = new LeanKitClient(accountName, email, password);
//        client.getBoard(249156903, ( function( err, boards ) {
//	        console.log( boards );
//        } );
        res.send("OK");
    });

    // =========================== FRONTEND IN ANGULAR ================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};