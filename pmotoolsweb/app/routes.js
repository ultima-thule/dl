 // app/routes.js

// grab the card model we just created
var Team = require('./model/team');
var Report = require('./model/report');
var ConfigParam = require('./model/configparam');
var Card = require('./model/card');
var Sponsor = require('./model/sponsor');
var Board = require('./model/board');
var UserApp  = require('./model/userApp');
var User  = require('./model/user');
var QuarterPlan = require('./model/quarterPlan');
var LeanKitClient  = require("leankit-client");
var Estimate = require('./model/estimate');
var Pwfile = require('./model/pwfile');
var https = require('https');
var http = require('http');
var _ = require('lodash');
var fs = require('fs');
var PythonShell = require('python-shell');

var jiraAuth = 'readonly_pmo:CbobBsps?!';

module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes


    function isAuthorized(req, res, next) {
        if (req.session.authorized) next();
        else {
            var params = req.query;
            params.backUrl = req.path;
            res.redirect('/login?' + query.stringify(params));
        }
    };

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


    // get all reports - all formats
    app.get('/api/reports', function(req, res) {
        // use mongoose to get all teams in the database
        Report.find({is_plan: false}).limit(5).sort('-generation_date').exec (function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });
    });

    // get all reports - format 1
    app.get('/api/reports/format1', function(req, res) {
        // use mongoose to get all teams in the database
        Report.find({is_plan: false, format_type: "1"}).limit(1).sort('-generation_date').exec (function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });
    });

    // get all reports - format 2
    app.get('/api/reports/format2', function(req, res) {
        // use mongoose to get all teams in the database
        Report.find({is_plan: false, format_type: "2"}).limit(1).sort('-generation_date').exec (function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });
    });


    // get all reports - format 3
    app.get('/api/reports/format3', function(req, res) {
        // use mongoose to get all teams in the database
        Report.find({is_plan: false, format_type: "3"}).limit(1).sort('-generation_date').exec (function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });
    });

    // gel all reports
    app.get('/api/reports/plan', function(req, res) {
        // use mongoose to get all teams in the database
        Report.find({is_plan: true}).limit(5).sort('-generation_date').exec (function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });
    });

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


    // generate new report with python script
    app.get('/api/genreport/:id', function(req, res) {
        if (req.params.id === "2") {
            //var python = require('child_process').spawn('/usr/bin/python3', ['/home/asia/git/dl/pmotoolsweb/public/python/py_gen_team.py']);
            var python = require('child_process').spawn('/usr/bin/python3.4', ['/home/httpd/dl/pmotoolsweb/public/python/py_gen_teams.py']);
//            var python = require('child_process').spawn('E://Programs//Dev//Python35-32//python.exe', ["E://Development//Projects//dl//pmotoolsweb//public//python//py_gen_teams.py"]);
        }
        else if (req.params.id === "3") {
            //var python = require('child_process').spawn('/usr/bin/python3', ['/home/asia/git/dl/pmotoolsweb/public/python/py_gen_team_2.py']);
            var python = require('child_process').spawn('/usr/bin/python3.4', ['/home/httpd/dl/pmotoolsweb/public/python/py_gen_teams_2.py']);
//            var python = require('child_process').spawn('E://Programs//Dev//Python35-32//python.exe', ["E://Development//Projects//dl//pmotoolsweb//public//python//py_gen_teams_2.py"]);
        }
        else {
            //var python = require('child_process').spawn('/usr/bin/python3', ['/home/asia/git/dl/pmotoolsweb/public/python/py_gen.py']);
            var python = require('child_process').spawn('/usr/bin/python3.4', ['/home/httpd/dl/pmotoolsweb/public/python/py_gen.py']);
//            var python = require('child_process').spawn('E://Programs//Dev//Python35-32//python.exe', ["E://Development//Projects//dl//pmotoolsweb//public//python//py_gen.py"]);
        }
        var output = "";
        python.stdout.on('data', function(data){ output += data });
        python.on('close', function(code)
        {
            console.log(code)
            if (code !== 0) {  return res.send(500, code); }
            return res.send(200, output)
        });
    });

    // generate new report with python script
    app.get('/api/genreportplan', function(req, res) {

        //var python = require('child_process').spawn('/usr/bin/python3', ['/home/asia/git/dl/pmotoolsweb/public/python/py_gen_plan.py']);
        var python = require('child_process').spawn('/usr/bin/python3.4', ['/home/httpd/dl/pmotoolsweb/public/python/py_gen_plan.py']);
        //var python = require('child_process').spawn('C://python34//python.exe', ["C://Users//jgrzywna//PycharmProjects//dl//pmotoolsweb//public//python//py_gen_plan.py"]);

        var output = "";
        python.stdout.on('data', function(data){ output += data });
        python.on('close', function(code)
        {
            console.log(code)
            if (code !== 0) {  return res.send(500, code); }
            return res.send(200, output)
        });
    });

    // =========================== PW ================================

    // get a estimate in excel format
    app.get('/api/estimates/:id', function(req, res) {
        Estimate.find({_id: req.params.id}, function(err, estimates) {
            if (err)
                res.send(err);
            var date = estimates[0].generation_date.toISOString().replace(/T/, ' ').replace(/\..+/, '')
            res.append('Content-Disposition', 'attachment; filename=report_' + date + '.xlsx');
            res.append('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(estimates[0].xls_data);
          });
    });

    // generate new pw estimate with python script
    app.get('/api/genestimate/:id', function(req, res) {
        //var python = require('child_process').spawn('/usr/bin/python3', ['/home/asia/git/dl/pmotoolsweb/public/python/gen_estimate_tofile.py ' + req.params.id]);
        //PROD
        var python = require('child_process').spawn('/usr/bin/python3.4', ['/home/httpd/dl/pmotoolsweb/public/python/gen_estimate_tofile.py', req.params.id]);
        //HOME
        //var python = require('child_process').spawn('E://Programs//Dev//Python35-32//python.exe', ["E://Development//Projects//dl//pmotoolsweb//public//python//gen_estimate_tofile.py " + req.params.id]);

        var output = "";
        python.stdout.on('data', function(data){ output += data });
        python.on('close', function(code)
        {
//            console.log(code)
            if (code !== 0) {  return res.send(500, code); }

            Pwfile.find({"project": req.params.id, "format_type": "XLSX"}).sort('-generation_date').exec(function(err, estfiles) {
                if (err)
                    res.send(err);
                if (estfiles.length > 0) {
                    var date = estfiles[0].date_text;
                    res.append('Content-Disposition', 'attachment; filename=' + estfiles[0].project + '_' + date + '.xlsx');
                    res.append('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.send(estfiles[0].data);
                    }
                    else {
                        return res.send(200, output)
                    }
              });
        });
    });

    // generate new pw scope with python script
    app.get('/api/genscope/:id', function(req, res) {
        //var python = require('child_process').spawn('/usr/bin/python3', ['/home/asia/git/dl/pmotoolsweb/public/python/gen_scope_tofile.py ' + req.params.id]);
        //PROD
        var python = require('child_process').spawn('/usr/bin/python3.4', ['/home/httpd/dl/pmotoolsweb/public/python/gen_scope_tofile.py', req.params.id]);
        //HOME
        //var python = require('child_process').spawn('E://Programs//Dev//Python35-32//python.exe', ["E://Development//Projects//dl//pmotoolsweb//public//python//gen_scope_tofile.py " + req.params.id]);

        var output = "";
        python.stdout.on('data', function(data){ output += data });
        python.on('close', function(code)
        {
//            console.log(code)
            if (code !== 0) {  return res.send(500, code); }

            Pwfile.find({"project": req.params.id, "format_type": "DOCX"}).sort('-generation_date').exec(function(err, scopefiles) {
                if (err)
                    res.send(err);
                if (scopefiles.length > 0) {
                    var date = scopefiles[0].date_text;
                    res.append('Content-Disposition', 'attachment; filename=' + scopefiles[0].project + '_' + date + '.docx');
                    res.append('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                    res.send(scopefiles[0].data);
                }
                else {
                    return res.send(200, output)
                }
              });
        });
    });

    // create PW with script
    app.get('/api/createpw/:pwid/sprint/:sprintid', function(req, res) {

        //var python = require('child_process').spawn('/usr/bin/python3', ['/home/asia/git/dl/pmotoolsweb/public/python/py_gen_team.py']);
        //var python = require('child_process').spawn('/usr/bin/python3.4', ['/home/httpd/dl/pmotoolsweb/public/python/add_page5.py']);
        //prod
        var python = require('child_process').spawn('/usr/bin/python3.4', ['/home/httpd/dl/pmotoolsweb/public/python/add_sprint_page_yattag.py', req.params.pwid, req.params.sprintid]);
        //mac
        //var python = require('child_process').spawn('python3', ['/Users/jgrzywna/Projects/dl/pmotoolsweb/public/python/add_sprint_page.py', req.params.pwid, req.params.sprintid]);
//        var python = require('child_process').spawn('E://Programs//Dev//Python35-32//python.exe', ["E://Development//Projects//dl//pmotoolsweb//public//python//add_sprint_page.py",
//            req.params.pwid, req.params.sprintid]);

        var output = "";
        python.stdout.on('data', function(data){ output += data });
        python.on('close', function(code)
        {
            if (code !== 0) {  return res.send(500, code); }
            return res.send(200, output)
        });
    });


    // =========================== CONFIG ================================

    // get a single config param
    app.get('/api/namedparams/:id', function(req, res) {
        ConfigParam.find({param_key: req.params.id}, function(err, configparams) {
            if (err)
                res.send(err);
            res.json (configparams);
          });
    });

    // get all params
    app.get('/api/params', function(req, res) {
        ConfigParam.find(function(err, params) {
            if (err)
                res.send(err);
            res.json(params);
        });
    });

    // get a single param D
    app.get('/api/params/:id', function(req, res) {
        ConfigParam.findOne({param_key : req.params.id}, function(err, param) {
            if (err)
                res.send(err);
            res.json(param);
        });
    });

    // create new sponsor
    app.post('/api/params', function(req, res) {
        ConfigParam.create(req.body, function (err, param) {
            if (err)
                res.send(err);
            res.send(200);
        })
    });

    // update a single param
    app.put('/api/params/:id', function(req, res) {
        ConfigParam.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, function (err, param) {
            res.send(param);
        });
    });


    // =========================== CARD ================================

    // get all initiatives
    app.get('/api/cards', function(req, res) {
        Card.find({board_masterlane_title: "ROOT LANE"},
        'title extended_data team_name taskboard_completed_card_size size taskboard_completion_percent due_date workflow_status_name',
        function(err, cards) {
            if (err)
                res.send(err);
            res.json(cards);
        });
    });

    // get a single card
    app.get('/api/cards/:id', function(req, res) {
        Card.findOne({_id : req.params.id}, function(err, card) {
            if (err)
                res.send(err);
            res.json(card);
        });
    });

    // update a single card
    app.put('/api/cards/:id', function(req, res) {
        Card.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, function (err, card) {
            res.send(card);
        });
    });

    // =========================== AGENDA PLANNING ================================
    // get all planned initiatives - to plot a total company network graph
    app.get('/api/agenda/supportrequested', function(req, res) {
        QuarterPlan.aggregate([
                    {
                        $match: {
                            board_masterlane_title: "Development backlog",
                            workflow_status_name: "Next quarter development plan",
                            type_name: {$ne: "Plan: support"}
                         }
                    },
                    {
                        $group: { _id: {title: '$title', team: "$team_name"}}
                    },
                    {
                        $lookup: {
                            from: "quarterPlan",
                            localField: "_id.title",
                            foreignField: "title",
                            as: "supportedBy"
                        }
                    },
                    {
                        $project: {
                            _id: 1, "supportedBy.team_name": 1
                        }
                    },
                    {
                        $unwind: "$supportedBy"
                    },
                    {
                        $group: { _id: {masterTeam: '$_id.team', supportTeam: '$supportedBy.team_name'}, total: {$sum: 1}}
                    }
                ], function (err, result) {
                    if (err)
                        res.send(err);
                    res.json(result);
            });
    });

    //get recommended initiatives for a team vs capacity
   app.get('/api/agenda/team/recommended', function(req, res){
        QuarterPlan.aggregate([{
                    $match: {
                        board_masterlane_title: "Development backlog",
                        workflow_status_name: "Next quarter development plan",
                        class_of_service_title: "Grooming: IT Recommendation" }
                    },
                    {
                    $group: { _id: '$team_name',
                        total: {$sum: '$size'} }
                    },
                    {
                    $lookup: {
                        from: "team",
                        localField: "_id",
                        foreignField: "name",
                        as: "teamagg" }
                    }
                ], function (err, result) {
                    if (err)
                        res.send(err);
                    res.json(result);
            });
        });

    //get teams with zero capacity
   app.get('/api/agenda/team/zerocapacity', function(req, res){
        Team.find({
            $and: [
                {ignore: false},
                {$or: [{capacity: 0}, {capacity: null}]},
            ]},
            'name location sm pmo',
            function(err, teams) {
                if (err)
                    res.send(err);
                res.json(teams);
            });
    });

    //for a team, aggregate types of planned initiatives
     app.get('/api/agenda/team/total/:id', function(req, res){
        QuarterPlan.aggregate([{
                    $match: {
                        team_name: req.params.id,
                        board_masterlane_title: "Development backlog",
                        workflow_status_name: "Next quarter development plan" }
                    },
                    {
                    $group: { _id: '$class_of_service_title',
                        total: {$sum: '$size'} }
                    },
                    { $sort: {total: -1} }
                ], function (err, result) {
                    if (err)
                        res.send(err);
                    res.json(result);
            });
        });

    // get all planned initiatives for a team - to plot a network graph
    app.get('/api/agenda/team/supportrequested/:id', function(req, res) {
        QuarterPlan.aggregate([
                    {
                        $match: {
                            team_name: req.params.id,
                            board_masterlane_title: "Development backlog",
                            workflow_status_name: "Next quarter development plan",
                            type_name: {$ne: "Plan: support"}
                         }
                    },
                    {
                        $group: { _id: '$title',}
                    },
                    {
                        $lookup: {
                            from: "quarterPlan",
                            localField: "_id",
                            foreignField: "title",
                            as: "aggregated"
                        }
                    },
                    {
                        $project: {
                            _id: 1, "aggregated.team_name": 1
                        }
                    },
                    {
                        $unwind: "$aggregated"
                    },
                    {
                        $group: { _id: '$aggregated.team_name', total: {$sum: 1}}
                    },
                    {
                        $match: {
                            _id: {$ne: req.params.id}
                         }
                    }
                ], function (err, result) {
                    if (err)
                        res.send(err);
                    res.json(result);
            });
    });


    // get all planned initiatives for a team
    app.get('/api/agenda/team/:id', function(req, res) {
        QuarterPlan.find({team_name: req.params.id, board_masterlane_title: "Development backlog", workflow_status_name: "Next quarter development plan"},
        'title description extended_data team_name size due_date class_of_service_title type_name external_card_id comments',
        function(err, cards) {
            if (err)
                res.send(err);
            res.json(cards);
        });
    });

    //get all initiatives costs with supports (matched by names)
     app.get('/api/agenda/initiative', function(req, res){
        QuarterPlan.aggregate([{
                    $match: {
                        board_masterlane_title: "Development backlog",
                        workflow_status_name: "Next quarter development plan" }
                    },
                    {
                    $group: { _id: '$title',
                        total: {$sum: '$size'} }
                    },
                    { $sort: {total: -1} }
                ], function (err, result) {
                    if (err)
                        res.send(err);
                    res.json(result);
            });
        });

    //get recommended initiatives with zero cost
     app.get('/api/agenda/initiative/zerocost', function(req, res){
         QuarterPlan.find({
                board_masterlane_title: "Development backlog",
                workflow_status_name: "Next quarter development plan",
                class_of_service_title: "Grooming: IT Recommendation",
                size: 0
            },
            'title description team_name size assigned_user_name',
            function(err, teams) {
                if (err)
                    res.send(err);
                res.json(teams);
            });
        });

    //get all master initiatives
     app.get('/api/agenda/initiative/master', function(req, res){
         QuarterPlan.find({type_name: {$ne: "Plan: support"}},
        'title team_name',
        function(err, cards) {
            if (err)
                res.send(err);
            res.json(cards);
        });
     });

    //get all supports for an initiative
     app.get('/api/agenda/initiative/supports/:id', function(req, res){
         QuarterPlan.find({title: req.params.id, board_masterlane_title: "Development backlog", workflow_status_name: "Next quarter development plan"},
        'title team_name size class_of_service_title type_name external_card_id',
        function(err, cards) {
            if (err)
                res.send(err);
            res.json(cards);
        });
     });



    // =========================== CHARTS ================================

    app.get('/api/dashboard/cardbysponsor', function(req, res){
        Card.aggregate([{
                $match: {
                    board_masterlane_title: "ROOT LANE",
                    workflow_status_name: "In progress" }
                },
                {
                $group: { _id: '$extended_data.sponsor_name',
                    count: {$sum: 1} }
                },
                { $sort: {count: -1} }
            ], function (err, result) {
                if (err)
                    res.send(err);
                res.json(result);
        });
    });

    app.get('/api/dashboard/cardbyworkflowstatus', function(req, res){
        Card.aggregate([
                {
                    $match: { board_masterlane_title: "ROOT LANE" }
                },
                {
                    $group: {
                        _id: '$workflow_status_name',
                        count: {$sum: 1}
                    }
                },
                {
                    $sort: {count: -1}
                }
            ], function (err, result) {
                if (err)
                    res.send(err);
                res.json(result);
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


    // =========================== USER ================================

    // get all users
    app.get('/api/usersLeankit', function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });

    // get a single user
    app.get('/api/usersLeankit/:id', function(req, res) {
        User.findOne({upn : req.params.id}, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    });


    // update a single user
    app.put('/api/usersLeankit/:id', function(req, res) {
        User.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, function (err, user) {
            res.send(user);
        });
    });

    // =========================== JIRA ================================
    // get all scrum boards
    app.get('/api/jira/boards', function(req, res) {
        http.get({
                host: 'jira.grupa.onet',
                path: '/rest/agile/1.0/board?type=scrum',
                auth: jiraAuth
        }, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                var parsed = JSON.parse(body);
                res.send(parsed.values);
            });
        }).on('error', function(e) {
            console.error("Error: " + e.message);
            res.status(500).send('Error ' + e.message);
        });;
    });

    // get scrum board
    app.get('/api/jira/boards/:id', function(req, res) {
        http.get({
                host: 'jira.grupa.onet',
                path: '/rest/agile/1.0/board/' + req.params.id,
                auth: jiraAuth
        }, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                res.send(JSON.parse(body));
            });
        }).on('error', function(e) {
            console.error("Error: " + e.message);
            res.status(500).send('Error ' + e.message);
        });;
    });


    // get all sprints in board
    app.get('/api/jira/boards/:id/sprint/:page', function(req, res) {

        http.get({
                host: 'jira.grupa.onet',
                path: '/rest/agile/1.0/board/' + req.params.id + '/sprint?state=active,closed&maxResults=50&startAt=' + (req.params.page-1)*50,
                auth: jiraAuth
        }, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                var parsed = JSON.parse(body);
                var sorted = _.sortBy(parsed.values, "startDate").reverse();
                res.send(sorted);
            });
        }).on('error', function(e) {
            console.error("Error: " + e.message);
            res.status(500).send('Error ' + e.message);
        });;
    });


    // =========================== USER APP================================
    // create new user app
    app.put('/api/users', function(req, res) {
        UserApp.create(req.body, function (err, small) {
            if (err)
                res.send(err);
            res.send(200);
        })
    });

    // get a single user app
    app.get('/api/users/:id', function(req, res) {
        UserApp.findOne({upn : req.params.id}, function(err, user) {
            if (err)
                res.send(err);

            res.json(user);
        });
    });


    // update a single user app
    app.put('/api/users/:id', function(req, res) {
        UserApp.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, function (err, user) {
            res.send(user);
        });
    });

    // =========================== LEANKIT SYNCHRONIZATION ================================

    // get all boardsfrom leankit
    app.get('/api/synchronize/boards', function(req, res) {
        var client = new LeanKitClient  ("dreamlab", "joanna.grzywna@grupaonet.pl", "piotrek2003");
        client.getBoards(function(err, boards) {
            if (err)
                res.send(err);
            res.json(boards);
        });
    });

    // get single board
    app.get('/api/synchronize/boards/:id', function(req, res) {
        var client = new LeanKitClient  ("dreamlab", "joanna.grzywna@grupaonet.pl", "piotrek2003");
        client.getBoard(req.params.id, function(err, board) {
            if (err)
                res.send(err);
            res.json(board);
        });
    });


    // =========================== CHECK AUTHENTICATION ================================
    app.get('/api/me/:id', function(req, res) {

        https.get({
                host: 'cloud.onet.pl',
                path: '/me?access_token=' + req.params.id
        }, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                res.send(body);
                // Data reception is done, do whatever with it!
//                var parsed = JSON.parse(body);
//                callback({
//                    email: parsed.email,
//                    password: parsed.pass
//                });
            });
        });
    });


    // =========================== FRONTEND IN ANGULAR ================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load our public/index.html file
    });

};
