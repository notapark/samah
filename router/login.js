module.exports = (app, fs, connection) => {
  app.get('/logout', (req, res) => {
    const sess = req.session;
    if (sess.name) {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/');
        }
      });
    } else {
      res.redirect('/');
    }
  });

  app.get('/login', (req, res) => {
    res.render('login', {
      name: null,
    });
  });

  app.post('/dologin', (req, res) => {
    const sess = req.session;

    connection.query('select user_name from users where user_id = ? and password = ? ', [req.body.userid, req.body.password], (err, result) => {
      if (err) {
        console.error(err);
      } else {
        sess.name = result[0].user_name;
        res.redirect('/');
      }
    });
  });

  app.get('/join', (req, res) => {
    const sess = req.session;
    res.render('join', {
      name: sess.name,
    });
  });

  app.post('/dojoin', (req, res) => {
    const user = {
      user_id: req.body.userid,
      user_name: req.body.username,
      password: req.body.password,
    };

    connection.query('insert into users set ?', user, (err) => {
      if (err) {
        console.error(err);
        connection.rollback(() => {
          console.error('rollback error');
          throw err;
        });
      }
      connection.commit((err1) => {
        if (err1) {
          console.error(err1);
          connection.rollback(() => {
            console.error('rollback error');
            throw err1;
          });
        } else {
          res.render('login', {
            name: null,
          });
        }
      });
    });
  });
};
