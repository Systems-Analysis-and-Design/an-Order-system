var fs = require('fs');
var path = require('path');
var url = require('url');
var crypto = require('crypto');
var User = require('../models/user');

module.exports = function(app) {
  /* GET home page. */
  app.get('/', function(req, res, next) {
    res.render('home', { title: '皮皮怪点餐' });
  });

  app.post('/', function (req, res) {
    //表单类型
    var type = url.parse(req.url).query;
    if (type == 'regist') {
      //生成密码的 md5 值
      var md5 = crypto.createHash('md5');
      var password = md5.update(req.body.password).digest('hex');
      var newUser = new User({
        name: req.body.username,
        password: password,
        phone: req.body.phone,
        email: req.body.email
      });
      console.log(newUser.name);
      //检查用户名是否已经存在 
      User.get(newUser.name, function (err, user) {
        if (err) {
            return res.json(err);
        }
        if (user) {
            return res.json("exited");
        }
        newUser.save(function (err, user) {
            if (err) {
                return res.json(err);
            }
            req.session.user = user;
            return res.json("success");
        });
      });
    } else if(type == 'login') {
      //登录表单处理
    }
  }

  app.use(function (req, res) {    //获取css,js,img
    return res.sendFile(__dirname + '../public' + req.url);
  });
}
