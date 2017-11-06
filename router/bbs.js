module.exports = (app, fs, connection, upload) => {
  app.get('/bbs/master/list', (req, res) => {
    const sess = req.session;
    let sql = '';
    let yyyymm = '';
    yyyymm = new Date().toISOString().substr(0, 7).replace('-', '');

    console.log('req.body.schMonth : ${req.body.schMonth}');

    if (req.body.schMonth != null) {
      yyyymm = req.body.schMonth;
    }
    console.log('yyyymm : ${yyyymm.replace(\'-\', \'\')}');
    // let schMonth = req.body.schMonth;
    // console.log("schMonth : " + schMonth);
    sql += 'select bbsno, subject, wname, date_format(regdate,"%Y년%m월%d일") as regdate, case status when 0010 then "신규" when 0020 then "진행중" when 0030 then "완료" end status_nm , status ';
    sql += 'from tb_bbs ';
    sql += 'where type="main" ';
    sql += 'where date_format(regdate,"%Y%c") = ?';
    sql += 'and type="main" ';
    sql += 'order by bbsno desc;';

    connection.query(sql, yyyymm, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        res.render('bbs/masterlist', {
          name: sess.name,
          rs: result,
        });
      }
    });
  });

  app.post('/bbs/master/list/ajax', (req, res) => {
    const sess = req.session;
    let sql = '';
    let yyyymm = new Date().toISOString().substr(0, 7).replace('-', '');
    console.log('req.body.schMonth : ${req.body.schMonth}');
    if (req.body.schMonth != null) {
      yyyymm = req.body.schMonth.replace('-', '');
    }
    console.log('yyyymm : ${yyyymm}');
    // let schMonth = req.body.schMonth;
    // console.log("schMonth : " + schMonth);
    sql += 'select bbsno, subject, wname, date_format(regdate,"%Y년%m월%d일") as regdate, case status when 0010 then "신규" when 0020 then "진행중" when 0030 then "완료" end status_nm , status ';
    sql += 'from tb_bbs ';
    // sql += 'where type="main" ';
    sql += 'where date_format(regdate,"%Y%c") = ? and type="main" ';
    sql += 'order by bbsno desc;';
    connection.query(sql, [yyyymm], (err, result) => {
      if (err) {
        console.error(err);
      } else {
        res.send({
          name: sess.name,
          rs: result,
        });
        // res.render('bbs/masterlist',{
        //   name: sess.name,
        //   rs: result
        // })
      }
    });
  });

  app.get('/bbs/main/list', (req, res) => {
    const sess = req.session;
    let sql = '';
    sql += 'select bbsno, subject, wname, date_format(regdate,"%Y년%m월%d일") as regdate, case status when 0010 then "신규" when 0020 then "진행중" when 0030 then "완료" end status_nm , status from tb_bbs where type="main" order by bbsno desc;';
    connection.query(sql, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        res.render('bbs/mainlist', {
          name: sess.name,
          rs: result,
        });
      }
    });
  });

  app.get('/bbs/main/write', (req, res) => {
    const sess = req.session;
    let bbsid = '';
    let sqlgetandupdateseq = 'select bbsno + 1 bbsno from tb_bbs_seq;';
    sqlgetandupdateseq += 'update tb_bbs_seq set bbsno = bbsno + 1;';

    connection.query(sqlgetandupdateseq, (err, result) => {
      console.log('result : ${result}');
      bbsid = result[0][0].bbsno;
      res.render('bbs/mainwrite', {
        name: sess.name,
        bbsno: bbsid,
      });
    });
  });

  app.get('/bbs/main/view/:bbsno', (req, res) => {
    const sess = req.session;
    const bbsno = req.params.bbsno;

    let sql = 'select * from tb_bbs where bbsno =?;';
    sql += 'select * from tb_bbs_file where file_id =?;';
    connection.query(sql, [bbsno, bbsno], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.render('bbs/mainview', {
          name: sess.name,
          rs: result[0],
          rsfile: result[1],
        });
      }
    });
  });

  app.post('/bbs/main/dowrite', upload.array('attachfile'), (req, res) => {
    let sql = '';
    const ip = req.headers['x-forwarded-for'] ||
             req.connection.remoteAddress ||
             req.socket.remoteAddress ||
             req.connection.socket.remoteAddress;

    // 첨부파일 처리 부분
    const upfile = req.files; // 업로드 된 파일을 받아옴

    const bbsno = req.body.bbsno;
    const subject = req.body.subject;
    const passwd = req.body.passwd;
    const content = req.body.content;
    const wname = req.body.wname;
    const type = req.body.type;
    const status = req.body.status;


    if (isSaved(upfile)) { // 파일이 제대로 업로드 되었는지 확인 후 디비에 저장시키게 됨
      savefileinfo(upfile, bbsno);
    } else {
      console.log('파일이 저장되지 않았습니다!');
    }

    sql = 'insert into tb_bbs (bbsno,subject, content, wname, passwd, ip, grpno,  regdate, type, status) values(?,?,?,?,?,?,0,now(),?,?);';
    console.log('req.body.subject : ${req.body.subject}');
    connection.query(sql, [bbsno, subject, content, wname, passwd, ip, type, status], (err) => {
      if (err) {
        console.error(err);
      } else {
        res.redirect('/bbs/main/list');
      }
    });
  });


  app.post('/bbs/main/doupdate', upload.array('attachfile'), (req, res) => {
    const ipAddr = req.headers['x-forwarded-for'] ||
             req.connection.remoteAddress ||
             req.socket.remoteAddress ||
             req.connection.socket.remoteAddress;
    const param = {
      subject: req.body.subject,
      content: req.body.content,
      wname: req.body.wname,
      passwd: req.body.passwd,
      ip: ipAddr,
    };

    const bbsno = req.body.bbsno;
    const sql = 'update tb_bbs set ?  where bbsno = ?';
    connection.query(sql, [param, bbsno], (err) => {
      if (err) {
        console.error(err);
      } else {
        res.redirect('/bbs/main/view/${bbsno}');
      }
    });
  });

  app.get('/filedownload/:filepath', (req, res) => {
    const filepath = '/samahhomepage/uploads/${req.params.filepath}';
    res.download(filepath);
  });

  app.get('/deletefile/:filepath/:bbsno', (req, res) => {
    const filepath = req.params.filepath;
    const fileid = req.params.bbsno;
    console.log(fileid);
    const sql = 'delete from tb_bbs_file where file_id = ? and file_name_rel = ?';
    connection.query(sql, [fileid, filepath], (err) => {
      if (err) {
        console.error(err);
      } else {
        res.redirect('/bbs/main/view/${fileid}');
      }
    });
  });

  function savefileinfo(upfile, fileid) {
    const savedFile = upfile;
    let result;
    const sqlinsertfile = 'insert into tb_bbs_file(file_id, file_name_ori, file_name_rel, file_path, regdate, regid,seq) values(?,?,?,?,now(),?,?);';

    if (savedFile != null) {
      for (let i = 0; i < savedFile.length; i += 1) {
        const filesave = savedFile[i];
        const filepath = '/samahhomepage/uploads/${fileid}${filesave.originalname}';
        const filenamerel = '${fileid}_${filesave.originalname}';
        const filenameori = filesave.originalname;

        fs.rename(filesave.path, '/samahhomepage/uploads/${fileid}_filesave.originalname', (err) => {
          if (err) {
            console.log(err);
          }
        });
        connection.query(sqlinsertfile, [fileid, filenameori, filenamerel, filepath, 'aaa', i], (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    } else {
      result = 0;
    }
    return result;
  }

  function isSaved(upFile) {
    // 파일 저장 여부 확인해서 제대로 저장되면 디비에 저장되는 방식
    const savedFile = upFile;
    let result;
    let count = 0;
    // 파일 존재시 -> tmp폴더에 파일 저장여부 확인 -> 있으면 저장, 없으면 에러메시지
    if (savedFile != null) {
      for (let i = 0; i < savedFile.length; i += 1) {
        // fs 모듈을 사용해서 파일의 존재 여부를 확인한다.
        if (fs.statSync(getDirname(1) + savedFile[i].path).isFile()) {
          count += 1; // true인 결과 갯수 세서
        }
      }
      if (count === savedFile.length) {
        result = true;
      } else { // 파일이 다를 경우 false를 리턴함.
        result = false;
      }
    } else { // 파일이 처음부터 없는 경우
      result = true;
    }
    return result;
  }

  function getDirname(num) {
    const order = num;
    const dirname = __dirname.split('/');
    let result = '';
    for (let i = 0; i < dirname.length - order; i += 1) {
      result += '${dirname[i]}/';
    }
    return result;
  }

  app.get('/bbsetc', (req, res) => {
    const sess = req.session;
    res.render('index', {
      page: 'content/bbsetc.ejs',
      name: sess.name,
    });
  });
};
