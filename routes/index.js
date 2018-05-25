var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var User = require('../models/user');

module.exports = function(app) {
  /* GET home page. */
  app.get('/', function(req, res, next) {
    res.render('home', { title: '皮皮怪点餐' });
  });

  app.post('/', function (req, res) {
    //表单类型
    var op = req.query.op;
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');
    if (op == 'regist') {
      //生成密码的 md5 值
      var newUser = new User({
        name: req.body.username,
        password: password,
        phone: req.body.phone,
        email: req.body.email
      });
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
    }
    else if(op == 'login') {
      //登录表单处理
      var name = req.body.username;
      User.get(name, function (err, user) {
        if (err) {
            return res.json(err);
        }
        else if (user) {
            if(user.password == password){
              req.session.user = user;
              return res.json("success");
            }
            else {
              return res.json("wrongPassword");
            }
        }
        else {
          return res.json("notFound");
        }
      });
    }
  });


  //管理页
  app.get('/user', function(req, res, next) {
    var op = req.query.op;
    if (op == "logout") {
      req.session.user = null;
    }
    else {
      if(req.session.user) {
        if(req.session.user.name == req.query.username && req.query.info) {
          //防止通过改url访问他人数据

          // Test
          //待修改-根据请求的info页返回相应数据
          //user
          var user = new Object();
          user.name = req.session.user.name;
          user.phone = req.session.user.phone;
          user.email = req.session.user.email;
          user.storeName = "皮皮怪餐馆";
          user.storeAddress = "P城";
          //返回对象数组
          //ingredients
          var ingredients = new Array();
          var ingredient = new Object();
          ingredient.name = "咸鱼";
          ingredient.price = 648;
          ingredient.cost = 6;
          ingredient.stock = 0;
          ingredients[0] = ingredient;
          //menu
          var menu = new Array();
          var item = new Object();
          item.name = "咸鱼煲汤";
          item.ingredients = "咸鱼";
          item.cost = 6;
          item.price = 10;
          menu[0] = item;
          //evaluation
          var evaluation = new Array();
          var item = new Object();
          item.serialNumber = "0001";
          item.orderDetails = "咸鱼煲汤不要鱼加辣";
          item.taste = "超级棒";
          item.speedOfProduction = "超级快";
          item.serviceAttitude = "超级皮";
          item.totalEvaluation = "要上天";
          evaluation[0] = item;
          //employee
          var employee = new Array();
          var item = new Object();
          item.id = "0001";
          item.username = "test001";
          item.post = "厨师";
          item.name = "皮蛋";
          item.age = 18;
          item.phone = "12345678912"
          employee[0] = item;
          //accounts
          var accountsIn = new Array();
          var itemIn = new Object();
          itemIn.name = "咸鱼煲汤";
          itemIn.cost = 1;
          itemIn.price = 18;
          itemIn.soldNum = 1000;
          itemIn.income = 18000;
          itemIn.netIncome = 17000;
          accountsIn[0] = itemIn;
          var accountsOut = new Array();
          var itemOut = new Object();
          itemOut.id = 1;
          itemOut.event = "发工资";
          itemOut.cost = 5;
          itemOut.note = "两个月的份";
          accountsOut[0] = itemOut;
          return res.render('info-' + req.query.info, {user: user, ingredients: ingredients, menu: menu, evaluation: evaluation, employee: employee, accountsIn: accountsIn, accountsOut: accountsOut});
          // Test
        }
      return res.redirect('/user?username=' + req.session.user.name + '&info=personal');
      }
    }
    return res.redirect('/');
  });

  //修改表单
  app.post('/user', function(req, res, next) {
    // Test
    console.log(req.body);
    return res.json("success");
    //第1行数据
    // console.log(req.body['data[0][name]']);
    // console.log(req.body['data[0][price]']);
    // console.log(req.body['data[0][cost]']);
    // console.log(req.body['data[0][stock]']);
  });


  app.use(function (req, res) {    //获取css,js,img
    return res.sendFile(__dirname + '../public' + req.url);
  });
}
