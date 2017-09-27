var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs")
var mysql = require('mysql');



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


var server = app.listen(8000, function(){
 console.log("Express server has started on port 8000")
});

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
 secret: '@#@$MYSIGN#@$#$',
 resave: false,
 saveUninitialized: true,
 cookie:{maxAge:6000}
}));

var connection = mysql.createConnection({
    host    :'localhost',
    port : 3306,
    user : 'root',
    password : 'jong0914',
    database:'samah'
});


var router = require('./router/main')(app, fs);
var router = require('./router/login')(app, fs, connection);
var router = require('./router/bbs')(app, fs, connection);
