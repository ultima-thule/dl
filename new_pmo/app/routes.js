 // app/routes.js

// grab the card model we just created
var https = require('https');
var http = require('http');
var fs = require('fs');
var PythonShell = require('python-shell');
var timeout         = require('connect-timeout'); //express v4

var jiraAuth = 'readonly_pmo:CbobBsps?!';

// Function to convert an Uint8Array to a string
var uint8arrayToString = function(data){
    return String.fromCharCode.apply(null, data);
};

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

    app.use(timeout(120000));
    app.get('/api/test', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });   
    });

    // =========================== PW ================================


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


    // generate new pw estimate with python script
    app.get('/api/genestimate2/:id', function(req, res) {
        //var python = require('child_process').spawn('/usr/bin/python3', ['/home/asia/git/dl/pmotoolsweb/public/python/gen_estimate_tofile.py ' + req.params.id]);
        //PROD
        var python = require('child_process').spawn('/usr/bin/python3.4', ['/home/httpd/dl/pmotoolsweb/public/python/gen_estimate_tofile2.py', req.params.id]);
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
        console.log("startuje generacje");
        //var python = require('child_process').spawn('/usr/bin/python3', ['/home/asia/git/dl/pmotoolsweb/public/python/gen_scope_tofile.py ' + req.params.id]);
        //PROD
        var python = require('child_process').spawn('/usr/bin/python3.4', ['/home/httpd/dl/pmotoolsweb/public/python/gen_scope_tofile.py', req.params.id]);
        //HOME
        //var python = require('child_process').spawn('E://Programs//Dev//Python35-32//python.exe', ["E://Development//Projects//dl//pmotoolsweb//public//python//gen_scope_tofile.py " + req.params.id]);

        var output = "";
        python.stderr.on('data', function(data){ console.log(uint8arrayToString(data)) });
        python.stdout.on('data', function(data){ console.log("mam dane"); output += data });
        python.on('close', function(code)
        {
            console.log("wchodze");
            if (code !== 0) {  console.log("bug"); return res.send(500, code); }

            Pwfile.find({"project": req.params.id, "format_type": "DOCX"}).sort('-generation_date').exec(function(err, scopefiles) {
                if (err){
                    console.log("kolejny bug");
                    res.send(err);
                }
                if (scopefiles.length > 0) {
		    console.log("inna dlugosc");
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
        console.log("ok");
        python.stderr.on('data', function(data){ console.log(uint8arrayToString(data)) });
        python.stdout.on('data', function(data){ console.log(uint8arrayToString(data)); output += data });
        python.on('close', function(code)
        {
            if (code !== 0) {  return res.send(500, code); }
            return res.send(200, output)
        });
    });

    // create PW with script
    app.get('/api/createpwdesc/:pwid/sprint/:sprintid', function(req, res) {

        //var python = require('child_process').spawn('/usr/bin/python3', ['/home/asia/git/dl/pmotoolsweb/public/python/py_gen_team.py']);
        //var python = require('child_process').spawn('/usr/bin/python3.4', ['/home/httpd/dl/pmotoolsweb/public/python/add_page5.py']);
        //prod
        var python = require('child_process').spawn('/usr/bin/python3.4', ['/home/httpd/dl/pmotoolsweb/public/python/add_sprint_page_description_yattag.py', req.params.pwid, req.params.sprintid]);
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
