module.exports = function(app, fs, connection)
{
  connection.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
  });

  app.get('/login',function(req,res){
      var sess = req.session;
      res.render('login', {
      })
  });
  app.post('/dologin',function(req,res){
      var sess = req.session;
      var user = {'user_id':req.params.userid,
                  'password':req.params.password};
      var query = connection.query('select user_name from users where user_id = ? and password = ? ',req.params.userid, req.params.password,function(err,result){
        if (err) {
          console.error(err);
        }else{
          res.render('/',{
            name: sess.name,
          })
        };
        connection.release();
      });
  });

  app.post('/join',function(req,res){
      var user = {'user_id':req.body.userid,
                  'user_name':req.body.name,
                  'password':req.body.address};
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
            res.render('index', {
            });
          }
        });
        connection.release();
      });
  });


}
