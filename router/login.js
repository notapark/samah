module.exports = function(app, fs, connection)
{
  connection.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
  });


  app.get('/logout',function(req,res){
      sess = req.session;
      if(sess.name){
          req.session.destroy(function(err){
              if(err){
                  console.log(err);
              }else{
                  res.redirect('/');
              }
          })
      }else{
          res.redirect('/');
      }
  });

  app.get('/login',function(req,res){
      var sess = req.session;
      res.render('login', {
        name: null
      })
  });

  app.post('/dologin',function(req,res){
      var sess = req.session;
      var user = {'user_id':req.body.userid,
                  'password':req.body.password};

      var query = connection.query('select user_name from users where user_id = ? and password = ? ',[req.body.userid, req.body.password],function(err,result){
        if (err) {
          console.error(err);
        }else{
          sess.name = result[0].user_name;
          res.render('index',{
            name: sess.name,
            page: 'content/home.ejs'
          })
        };
      })
  });

  app.get('/join',function(req,res){
    var sess = req.session;
    res.render('join',{
      name: sess.name
    })
  });

  app.post('/dojoin',function(req,res){
    var user = {'user_id':req.body.userid,
                'user_name':req.body.username,
                'password':req.body.password};
    var query = connection.query('insert into users set ?',user,function(err,result){
      if (err) {
        console.error(err);
        connection.rollback(function () {
          console.error('rollback error');
          throw err;
        });
      }
      connection.commit(function (err) {
        if (err) {
          console.error(err);
          connection.rollback(function () {
            console.error('rollback error');
            throw err;
          });
        }else{
          res.render('login', {
            name: null
          })
        }
      })
    });
  });


}
