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

  app.post('/users',function(req,res){
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
