const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const mysql = require('mysql');
const multer = require('multer');
const upload = multer({ dest: 'uploads/tmp/' });
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);



const server = app.listen(8000, () => {
 console.log("Express server has started on port 8000")
});

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
 secret: '@#@$MYSIGN#@$#$', 
 resave: true,
 saveUninitialized: true,
 cookie:{maxAge:360000}
}));

var connection = mysql.createConnection({
    host    :'localhost', 
    port : 3306,
    user : 'root',
    password : 'jong0914',
    database:'samah',
    multipleStatements: true
});

connection.connect(function(err) {
  if (err) {
      console.error('mysql connection error');
      console.error(err);
      throw err;
  }
});

var router = require('./router/main')(app, fs, connection);
var router = require('./router/login')(app, fs, connection);
var router = require('./router/bbs')(app, fs, connection, upload);
