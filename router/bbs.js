module.exports = function(app, fs, connection)
{

  app.get('/bbs/main/list',function(req,res){
    var sess = req.session;
    var query = connection.query('select * from tb_bbs ',function(err,result){
      if (err) {
        console.error(err);
      }else{
        res.render('bbs/mainlist',{
          name: sess.name,
          rs: result
        })
      };
    });
  });

  app.get('/bbs/main/write',function(req,res){
    var sess = req.session;
    res.render('bbs/mainwrite',{
      name: sess.name
    });
  });

  app.post('/bbs/main/view',function(req,res){
    var sess = req.session;
    var bbsno = req.params.bbsno;
    console.log("bbsno : " + bbsno);
    var query = connection.query('select * from tb_bbs ',[bbsno],function(err,result){
      res.render('bbs/mainview',{
        name: sess.name
      });
    });
  });

  app.post('/bbs/main/dowrite',function(req,res){
    var sess = req.session;
    var sql = "";
    var ip = req.headers['x-forwarded-for'] ||
             req.connection.remoteAddress ||
             req.socket.remoteAddress ||
             req.connection.socket.remoteAddress;

             console.log(ip);
    sql += "insert into tb_bbs (subject, content, wname, passwd, ip, grpno,  regdate)";
    sql += " values(?,?,?,?,?,0,now())";
    var query = connection.query(sql,[req.body.subject, req.body.content, req.body.wname, req.body.passwd, ip],function(err,result){
      if (err) {
        console.error(err);
      }else{
        res.redirect('/bbs/main/list');
      };
    });
  });



/*
    app.get('/bbsmain',function(req,res){
        var sess = req.session;
        res.render('content/bbsmain', {
            name: sess.name
        })
    });
*/

    app.get('/bbsetc',function(req,res){
        var sess = req.session;
        res.render('index', {
            page: 'content/bbsetc.ejs',
            name: sess.name
        })
    });
}
