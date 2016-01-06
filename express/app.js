var express = require('express'),
    app = express();

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
    res.sendFile('index.html',{'root': __dirname + '/public/index'});
});

app.listen(3000)