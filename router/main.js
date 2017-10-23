module.exports = function(app, fs, connection)
{
    app.get('/',function(req,res){
        var sess = req.session;
        var sql = '';
        sql += 'select bbsno, subject, wname, date_format(regdate,"%Y년%m월%d일") as regdate, case status when 0010 then "신규" when 0020 then "진행중" when 0030 then "완료" end status_nm , status from tb_bbs where type="main" order by bbsno desc;';
        sql += 'select bbsno, subject, wname, date_format(regdate,"%Y년%m월%d일") as regdate, case status when 0010 then "신규" when 0020 then "진행중" when 0030 then "완료" end status_nm , status  from tb_bbs where type="etc"  order by bbsno desc;';
        var query = connection.query(sql,function(err,result){
          if (err) {
            console.error(err);
          }else{
            res.render('index',{
              page: 'content/home.ejs',
              name: sess.name,
              rsMain: result[0],
              rsEtc: result[1]
            })
          };
        });
    });


    app.get('/home',function(req,res){
        var sess = req.session;
        var sql = '';
        sql += 'select bbsno, subject, wname, date_format(regdate,"%Y년%m월%d일") as regdate, case status when 0010 then "신규" when 0020 then "진행중" when 0030 then "완료" end status_nm , status from tb_bbs where type="main" order by bbsno desc;';
        sql += 'select bbsno, subject, wname, date_format(regdate,"%Y년%m월%d일") as regdate, case status when 0010 then "신규" when 0020 then "진행중" when 0030 then "완료" end status_nm , status  from tb_bbs where type="etc" order by bbsno desc ;';
        var query = connection.query(sql,function(err,result){
          if (err) {
            console.error(err);
          }else{
            res.render('index',{
              page: 'content/home.ejs',
              name: sess.name,
              rsMain: result[0],
              rsEtc: result[1]
            })
          };
        });
    });

    app.get('/company',function(req,res){
        var sess = req.session;
        res.render('index', {
            page: 'content/company.ejs',
            name: sess.name,
            aaa: 'aaa'
        })
    });


    app.get('/contact',function(req,res){
        var sess = req.session;
        res.render('index', {
            page: 'content/contact.ejs',
            name: sess.name
        })
    });


/*
    app.get('/list', function (req, res) {
       fs.readFile( __dirname + "/../data/" + "user.json", 'utf8', function (err, data) {
           console.log( data );
           res.end( data );
       });
    })

    app.get('/getUser/:username', function(req, res){
       fs.readFile( __dirname + "/../data/user.json", 'utf8', function (err, data) {
            var users = JSON.parse(data);
            res.json(users[req.params.username]);
       });
    });

    app.post('/addUser/:username', function(req, res){

        var result = {  };
        var username = req.params.username;

        // CHECK REQ VALIDITY
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // LOAD DATA & CHECK DUPLICATION
        fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            if(users[username]){
                // DUPLICATION FOUND
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }

            // ADD TO DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            })
        })
    });

    app.put('/updateUser/:username', function(req, res){

        var result = {  };
        var username = req.params.username;

        // CHECK REQ VALIDITY
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // LOAD DATA & CHECK DUPLICATION
        fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            if(!users[username]){
                // DUPLICATION FOUND
                result["success"] = 0;
                result["error"] = "user not exists11111111111111";
                res.json(result);
                return;
            }

            // ADD TO DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            })
        })
    });

    app.delete('/deleteUser/:username', function(req, res){

        var result = {  };
        var username = req.params.username;

        // LOAD DATA & CHECK DUPLICATION
        fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            if(!users[username]){
                // DUPLICATION FOUND
                result["success"] = 0;
                result["error"] = "user not exists";
                res.json(result);
                return;
            }

            // delete users
            delete users[username];

            // SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            })
        })
    });

    app.get('/login/:username/:password', function(req, res){
        var sess;
        sess = req.session;

        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);
            var username = req.params.username;
            var password = req.params.password;
            var result = {};
            if(!users[username]){
                // USERNAME NOT FOUND
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            if(users[username]["password"] == password){
                result["success"] = 1;
                sess.username = username;
                sess.name = users[username]["name"];
                res.redirect('/');

            }else{
                result["success"] = 0;
                result["error"] = "incorrect";
                res.json(result);
            }
        })
    });

    */
}
