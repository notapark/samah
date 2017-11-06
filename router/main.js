module.exports = (app, fs, connection) => {
  app.get('/', (req, res) => {
    const sess = req.session;
    let sql = '';
    sql += 'select bbsno, subject, wname, date_format(regdate,"%Y년%m월%d일") as regdate, case status when 0010 then "신규" when 0020 then "진행중" when 0030 then "완료" end status_nm , status from tb_bbs where type="main" order by bbsno desc;';
    sql += 'select bbsno, subject, wname, date_format(regdate,"%Y년%m월%d일") as regdate, case status when 0010 then "신규" when 0020 then "진행중" when 0030 then "완료" end status_nm , status  from tb_bbs where type="etc"  order by bbsno desc;';
    connection.query(sql, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        res.render('index', {
          page: 'content/home.ejs',
          name: sess.name,
          rsMain: result[0],
          rsEtc: result[1],
        });
      }
    });
  });

  app.get('/home', (req, res) => {
    const sess = req.session;
    let sql = '';
    sql += 'select bbsno, subject, wname, date_format(regdate,"%Y년%m월%d일") as regdate, case status when 0010 then "신규" when 0020 then "진행중" when 0030 then "완료" end status_nm , status from tb_bbs where type="main" order by bbsno desc;';
    sql += 'select bbsno, subject, wname, date_format(regdate,"%Y년%m월%d일") as regdate, case status when 0010 then "신규" when 0020 then "진행중" when 0030 then "완료" end status_nm , status  from tb_bbs where type="etc" order by bbsno desc ;';
    connection.query(sql, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        res.render('index', {
          page: 'content/home.ejs',
          name: sess.name,
          rsMain: result[0],
          rsEtc: result[1],
        });
      }
    });
  });

  app.get('/company', (req, res) => {
    const sess = req.session;
    res.render('index', {
      page: 'content/company.ejs',
      name: sess.name,
      aaa: 'aaa',
    });
  });


  app.get('/contact', (req, res) => {
    const sess = req.session;
    res.render('index', {
      page: 'content/contact.ejs',
      name: sess.name,
    });
  });
};
