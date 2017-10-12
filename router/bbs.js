module.exports = function(app, fs, connection)
{

  app.get('/bbs/main/list',function(req,res){
    var sess = req.session;
    var sql = '';
    sql += 'select bbsno, subject, wname, date_format(regdate,"%Y년%m월%d일") as regdate from tb_bbs where type="main" order by bbsno desc;';
    var query = connection.query(sql,function(err,result){
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
    var bbsno = req.body.bbsno;
    var query = connection.query('select * from tb_bbs where bbsno =?',[bbsno],function(err,result){
      res.render('bbs/mainview',{
        name: sess.name,
        rs: result
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
    sql += "insert into tb_bbs (subject, content, wname, passwd, ip, grpno,  regdate, type)";
    sql += " values(?,?,?,?,?,0,now(),?)";
    var query = connection.query(sql,[req.body.subject, req.body.content, req.body.wname, req.body.passwd, ip, req.body.type],function(err,result){
      if (err) {
        console.error(err);
      }else{
        res.redirect('/bbs/main/list');
      };
    });
  });

  app.post('/bbs/main/doupdate',function(req,res){
    var sess = req.session;
    var sql = "";
    var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
    var param = {'subject':req.body.subject
                , 'content':req.body.content
                , 'wname':req.body.wname
                , 'passwd':req.body.passwd
                , 'ip': ip};

             console.log(ip);
    sql += "update tb_bbs set ?";
    sql += " where bbsno = ?";
    var query = connection.query(sql,[param, req.body.bbsno],function(err,result){
      if (err) {
        console.error(err);
      }else{
        res.render('bbs/main/view',{
          name: sess.name,
          bbsno: req.body.bbsno
        });
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
