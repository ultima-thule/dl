 // app/routes.js

// grab the card model we just created
var Team = require('./model/team');
var Report = require('./model/report');

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
        console.log("sprawdzamy 1")
        Report.find({_id: "5691bde4b4fa3855b9699394"}, function(err, reports) {
            console.log("sprawdzamy")
            if (err)
                res.send(err);
            console.log(reports[0]);
            res.append('Content-Disposition', 'attachment; filename=test.xlsx');
            res.append('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            console.log("File report was requested");
            res.send(reports[0].xls_data);
          //res.render('document', { document : document });
          });
    });


    // report api route
    app.get('/api/reports', function(req, res) {
        // use mongoose to get all teams in the database
        Report.find(function(err, reports) {

            console.log("get report")
            console.log(reports)
            // if there is an error retrieving, send the error.
                            // nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(reports); // return all teams in JSON format
        });
    });


    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};
