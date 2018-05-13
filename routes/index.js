var fs = require('fs');
var path = require('path');
var crypto = require('crypto'),
  User = require('../models/user.js');

module.exports = function(app) {
  /* GET home page. */
  app.get('/', function(req, res, next) {
    res.render('home', { title: '皮皮怪点餐' });
  });

  //app.post('/regist', checkNotLogin);
  app.post('/regist', function (req, res) {
    var name = req.body.username,
      password = req.body.password;

    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
      name: name,
      password: password,
      phone: req.body.phone,
      email: req.body.email
    });
    //检查用户名是否已经存在 
    User.get(newUser.name, function (err, user) {
      if (err) {
        // req.flash('error', err);
        // return res.redirect('/');
        return res.json(err);
      }
      if (user) {
        // req.flash('error', '用户已存在!');
        // return res.redirect('/');//返回注册页
        return res.json("exited");
      }
      //如果不存在则新增用户
      newUser.save(function (err, user) {
        if (err) {
          // req.flash('error', err);
          // return res.redirect('/');//注册失败返回主册页
          return res.json(err);
        }
        req.session.user = user;//用户信息存入 session
        // req.flash('success', '注册成功!');
        return res.json("success");
       // res.redirect('/');
      });
    });
    
  });

  // function checkLogin(req, res, next) {
  //   if (!req.session.user) {
  //     res.json(err);
  //     res.redirect('/');
  //   }
  //   next();
  // }

  // function checkNotLogin(req, res, next) {
  //   if (req.session.user) {
  //     res.json(err);
  //     res.redirect('/');
  //   }
  //   next();
  // }

}
