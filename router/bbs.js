module.exports = function(app, fs, connection, upload)
{

  app.get('/bbs/master/list',function(req,res){
    var sess = req.session;
    var sql = '';
    var yyyymm = new Date().toISOString().substr(0, 7).replace('-', '');
    console.log("req.body.schMonth : "+ req.body.schMonth);
    if(req.body.schMonth != null){
      yyyymm = req.body.schMonth;
    }
    console.log("yyyymm : "+ yyyymm.replace('-', ''));
    //var schMonth = req.body.schMonth;
    // console.log("schMonth : " + schMonth);
    sql += 'select bbsno, subject, wname, date_format(regdate,"%Y년%m월%d일") as regdate, case status when 0010 then "신규" when 0020 then "진행중" when 0030 then "완료" end status_nm , status ';
    sql += 'from tb_bbs ';
    sql += 'where type="main" ';
    // sql += 'where date_format(regdate,"%Y%c") = ? and type="main" ';
    sql += 'order by bbsno desc;';
    var query = connection.query(sql,function(err,result){
      if (err) {
        console.error(err);
      }else{
        // res.send({
        //   name: sess.name,
        //   rs: result
        // });
        res.render('bbs/masterlist',{
          name: sess.name,
          rs: result
        })
      };
    });
  });

    app.post('/bbs/master/list/ajax',function(req,res){
      var sess = req.session;
      var sql = '';
      var yyyymm = new Date().toISOString().substr(0, 7).replace('-', '');
      console.log("req.body.schMonth : "+ req.body.schMonth);
      if(req.body.schMonth != null){
        yyyymm = req.body.schMonth.replace('-', '');
      }
      console.log("yyyymm : "+ yyyymm);
      //var schMonth = req.body.schMonth;
      // console.log("schMonth : " + schMonth);
      sql += 'select bbsno, subject, wname, date_format(regdate,"%Y년%m월%d일") as regdate, case status when 0010 then "신규" when 0020 then "진행중" when 0030 then "완료" end status_nm , status ';
      sql += 'from tb_bbs ';
      // sql += 'where type="main" ';
      sql += 'where date_format(regdate,"%Y%c") = ? and type="main" ';
      sql += 'order by bbsno desc;';
      var query = connection.query(sql,[yyyymm],function(err,result){
        if (err) {
          console.error(err);
        }else{
          res.send({
            name: sess.name,
            rs: result
          });
          // res.render('bbs/masterlist',{
          //   name: sess.name,
          //   rs: result
          // })
        };
      });
    });

  app.get('/bbs/main/list',function(req,res){
    var sess = req.session;
    var sql = '';
    sql += 'select bbsno, subject, wname, date_format(regdate,"%Y년%m월%d일") as regdate, case status when 0010 then "신규" when 0020 then "진행중" when 0030 then "완료" end status_nm , status from tb_bbs where type="main" order by bbsno desc;';
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
    var bbsid = "";
    var sqlgetandupdateseq = "select bbsno + 1 bbsno from tb_bbs_seq;";
    sqlgetandupdateseq += "update tb_bbs_seq set bbsno = bbsno + 1;";

    var query = connection.query(sqlgetandupdateseq, function(err, result){
      console.log("result : "+ result);
      bbsid = result[0][0].bbsno;
      res.render('bbs/mainwrite',{
        name: sess.name,
        bbsno: bbsid
      });
    });

  });

  app.get('/bbs/main/view/:bbsno',function(req,res){
    var sess = req.session;
    var bbsno = req.params.bbsno;

    var sql = "select * from tb_bbs where bbsno =?;";
    sql += "select * from tb_bbs_file where file_id =?;";
    var query = connection.query(sql,[bbsno, bbsno],function(err,result){
      if(err){
        console.log(err);
      }else{
        res.render('bbs/mainview',{
          name: sess.name,
          rs: result[0],
          rsfile: result[1]
        });
      }
    });
  });

  app.post('/bbs/main/dowrite',upload.array('attachfile'),function(req,res){
    var sess = req.session;
    var sql = "";
    var ip = req.headers['x-forwarded-for'] ||
             req.connection.remoteAddress ||
             req.socket.remoteAddress ||
             req.connection.socket.remoteAddress;

             console.log(ip);

    // 첨부파일 처리 부분
    var upfile = req.files; // 업로드 된 파일을 받아옴

    //파라메터
    var bbsno     = req.body.bbsno;
    var subject   = req.body.subject;
    var passwd    = req.body.passwd;
    var content   = req.body.content;
    var wname     = req.body.wname;
    var type      = req.body.type;
    var status    = req.body.status;


    if (isSaved(upfile)) { // 파일이 제대로 업로드 되었는지 확인 후 디비에 저장시키게 됨
      savefileinfo(upfile, bbsno);
    } else {
      console.log("파일이 저장되지 않았습니다!");
    }

    sql = "insert into tb_bbs (bbsno,subject, content, wname, passwd, ip, grpno,  regdate, type, status) values(?,?,?,?,?,?,0,now(),?,?);";
    console.log("req.body.subject : " + req.body.subject );
    var query = connection.query(sql,[bbsno, subject, content, wname, passwd, ip, type, status],function(err,result){
      if (err) {
        console.error(err);
      }else{
        res.redirect('/bbs/main/list');
      };
    });
  });


  app.post('/bbs/main/doupdate',upload.array('attachfile'),function(req,res){
    var sess = req.session;
    var ip = req.headers['x-forwarded-for'] ||
             req.connection.remoteAddress ||
             req.socket.remoteAddress ||
             req.connection.socket.remoteAddress;
    var param = {'subject':req.body.subject
                , 'content':req.body.content
                , 'wname':req.body.wname
                , 'passwd':req.body.passwd
                , 'ip': ip};

    var bbsno = req.body.bbsno;
    console.log("bbsno : "+ bbsno );
    var sql = "update tb_bbs set ?  where bbsno = ?";
    var query = connection.query(sql,[param, bbsno],function(err,result){
      if (err) {
        console.error(err);
      }else{
        alert("수정완료");
        res.redirect('/bbs/main/view/'+ bbsno);
      };
    });
  });

  app.get('/filedownload/:filepath',function(req,res){
      var sess = req.session;
      var filepath = '/samahhomepage/uploads/'+req.params.filepath;
      console.log(filepath);
      res.download(filepath);
  });

  app.get('/deletefile/:filepath/:bbsno',function(req,res){
    var filepath = req.params.filepath;
    var fileid = req.params.bbsno;
    console.log(fileid);
    var sql = " delete from tb_bbs_file where file_id = ? and file_name_rel = ?";
    var query = connection.query(sql,[fileid, filepath],function(err,result){
      if (err) {
        console.error(err);
      }else{
        res.redirect('/bbs/main/view/'+ fileid);
      };
    });
  });


  function savefileinfo(upfile, fileid){
    var savedFile = upfile;
    var sqlinsertfile = "insert into tb_bbs_file(file_id, file_name_ori, file_name_rel, file_path, regdate, regid,seq) values(?,?,?,?,now(),?,?);";

    if(savedFile!= null){
      for (var i = 0; i < savedFile.length; i++) {
        var filesave = savedFile[i];
        var filepath = '/samahhomepage/uploads/'+ fileid + '_' + filesave.originalname;
        var filenamerel = fileid + '_' + filesave.originalname;
        var filenameori = filesave.originalname;

        fs.rename(filesave.path, '/samahhomepage/uploads/'+ fileid + '_' + filesave.originalname, function (err) {
            if (err) {
                console.log(err);
                return;
            }
        });
        var query = connection.query(sqlinsertfile,[fileid,filenameori, filenamerel, filepath,'aaa',i],function(err,result){
          if (err) {
            console.error(err);
          };
        });

      }
    }else{
      return
    }
  }

  function isSaved(upFile) {
      // 파일 저장 여부 확인해서 제대로 저장되면 디비에 저장되는 방식
      var savedFile = upFile;
      var count = 0;
      if(savedFile != null) { // 파일 존재시 -> tmp폴더에 파일 저장여부 확인 -> 있으면 저장, 없으면 에러메시지
          for (var i = 0; i < savedFile.length; i++) {
              if(fs.statSync(getDirname(1) + savedFile[i].path).isFile()){ //fs 모듈을 사용해서 파일의 존재 여부를 확인한다.
                  count ++; // true인 결과 갯수 세서
              };
          }
          if(count == savedFile.length){  //올린 파일 갯수랑 같으면 패스
              return true;
          }else{ // 파일이 다를 경우 false를 리턴함.
              return false;
          }
      }else{ // 파일이 처음부터 없는 경우
          return true;
      }
  }



  function getDirname(num){
    console.log("getDirname 111111111111111111");
    //원하는 상위폴더까지 리턴해줌. 0은 현재 위치까지, 1은 그 상위.. 이런 식으로
    // 리네임과, 파일의 경로를 따오기 위해 필요함.
    var order = num;
    var dirname = __dirname.split('/');
    var result = '';
    for(var i=0;i<dirname.length-order;i++){
        result += dirname[i] + '/';
    }
    return result;
  }

  app.get('/bbsetc',function(req,res){
      var sess = req.session;
      res.render('index', {
          page: 'content/bbsetc.ejs',
          name: sess.name
      })
  });
}
