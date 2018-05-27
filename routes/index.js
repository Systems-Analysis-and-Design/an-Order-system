var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var User = require('../models/user');
var Menu = require('../models/menu');
var Employee = require('../models/employee');
var Ingredient = require('../models/ingredient');
var mongodb = require('../models/db');

module.exports = function(app) {
  /* GET home page. */
  app.get('/', function(req, res, next) {
    res.render('home', { title: '皮皮怪点餐' });
  });

  app.post('/', function (req, res) {
    //表单类型
    var op = req.query.op;
    var info = req.query.info;
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');
    if (op == 'regist') {
      //生成密码的 md5 值
      var newUser = new User({
        name: req.body.username,
        password: password,
        phone: req.body.phone,
        email: req.body.email,
        storeName: req.body.storeName,
        storeAddress:req.body.storeAddress
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




//TEST  --------------------------------------------------------------------------------------
              // mongodb.open(function (err, db) {
              //   if (err) {
              //     return callback(err);//错误，返回 err 信息
              //   }
              //   //读取 users 集合
              //   db.collection('users', function (err, collection) {
              //     if (err) {
              //       mongodb.close();
              //       return callback(err);//错误，返回 err 信息
              //     }
              //     //查找用户名（name键）值为 name 一个文档
                  
              //     collection.find().toArray(function (err, result) {
              //       console.log(result);
              //       mongodb.close();
              //     });
              //   });
              // });


//------------------------------------------------------------------------------



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
    var info = req.query.info;
    if (op == "logout") {
      req.session.user = null;
      return res.redirect('/');
    }
    else {
        if (req.session.user) {
          if (req.session.user.name == req.query.username && req.query.info) {
            //防止通过改url访问他人数据
          if (info == 'personal') {
            var name = req.session.user.name;
            var show = new Object();
            User.get(name, function (err, user) {
              if (user) {
                show.name = user.name;
                show.phone = user.phone;
                show.email = user.email;
                show.storeName = user.storeName;
                show.storeAddress = user.storeAddress;
                return res.render('info-' + req.query.info, { user: show });
              }
            });
            }
          else if (info == 'menu') {
            var menu = new Array();
            var item = new Object();
            item.name = "咸鱼煲汤";
            item.ingredients = "咸鱼";
            item.cost = 6;
            item.price = 10;
            menu[0] = item;
          }

          else if (info == 'ingredients') {
            var ingredients = new Array();
            var ingredient = new Object();
            ingredient.name = "咸鱼";
            ingredient.price = 648;
            ingredient.cost = 6;
            ingredient.stock = 0;
            ingredients[0] = ingredient;
          }

          else if (info == 'evaluation') {
            var evaluation = new Array();
            var item = new Object();
            item.serialNumber = "0001";
            item.orderDetails = "咸鱼煲汤不要鱼加辣";
            item.taste = "超级棒";
            item.speedOfProduction = "超级快";
            item.serviceAttitude = "超级皮";
            item.totalEvaluation = "要上天";
            evaluation[0] = item;
          }

          else if (info == 'employee') {
            var name = req.session.user.name;
            var show = new Object();
            show.name = name;
            mongodb.open(function (err, db) {
              //读取 users 集合
              db.collection(name + '_employees', function (err, collection) {
                var query = {};
                var amount;
                collection.count(query,function (err, total) { 
                  amount = total;
                 // console.log(amount);
                });
                var employee = new Array();
                collection.find().toArray(function (err, result) {
                  for (var i = 0; i < amount; i++) {
                    var item = new Object();
                    item.id = (i+1).toString();
                    item.username = result[i].username;
                    item.post = result[i].post;
                    item.name = result[i].name;
                    item.age = result[i].age;
                    item.phone = result[i].phone;
                    employee[i] = item;
                  }
                  return res.render('info-' + req.query.info, { user:show, employee: employee });
                  mongodb.close();
                });
              });
              mongodb.close();
            });
          }

          else if (info == 'accounts') {
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
          }
        }
        else return res.redirect('/user?username=' + req.session.user.name + '&info=personal');
      }
          //return res.render('info-' + req.query.info, {user: show, ingredients: ingredients, menu: menu, evaluation: evaluation, employee: employee, accountsIn: accountsIn, accountsOut: accountsOut});
      }
  });

  //修改表单
  app.post('/user', function(req, res, next) {
    // Test
    var info = req.query.info;
    if (info == 'personal-store') {
      var name = req.query.username;
      var up = {
        $set: {
          'storeName': req.body.storeName,
          'storeAddress': req.body.storeAddress
        }
      };
      User.update(name, up, function (err, user) {
        if (err) {
          return res.json(err);
        }
      });
    }
    else if (info == 'personal-account') {
      var name = req.query.username;
      var up = {
        $set: {
          'phone': req.body.phone,
          'email': req.body.email
        }
      };
      User.update(name, up, function (err, user) {
        if (err) {
          return res.json(err);
        }
      });
    }
    else if (info == 'employee') {
      var op = req.query.op;
      var name = req.query.username;
      if (op == 'new') {
        var newEmployee = new Employee({
          owner: name,
          username: req.body.username,
          password: req.body.password,
          name: req.body.name,
          age: req.body.age,
          phone: req.body.phone,
          post: req.body.post
        });
        //检查用户名是否已经存在
        // mongodb.open(function (err, db) {
        //   if (err) {
        //     mongodb.close();
        //     return callback(err);//错误，返回 err 信息
        //   }
        //   //读取 employees 集合
        //   db.collection(newEmployee.owner + '_employees', function (err, collection) {
        //     if (err) {
        //       mongodb.close();
        //       return callback(err);//错误，返回 err 信息
        //     }
        //     //查找账户（值为 account 一个文档
        //     collection.insert(newEmployee, { safe: true }, function (err, employee) {
        //       mongodb.close();
        //     });
        //   });
        //   mongodb.close();
        // });
        Employee.get(newEmployee.owner, newEmployee.username, function (err, employee) {
          newEmployee.save(function (err, employee) {
            if (err) {
              return res.json(err);
            }
          });
        });
      }
      else if (op == 'save') {
        var arr = Object.keys(req.body);
        var len = arr.length / 7;
        var name = req.query.username;
        for (var i = 0; i < len; i++) {
          if (req.body['data[' + i + '][op]'] == 'save') {
            var up = {
              $set: {
                'post': req.body['data[' + i + '][post]'],
                'name': req.body['data[' + i + '][name]'],
                'age': req.body['data[' + i + '][age]'],
                'phone': req.body['data[' + i + '][phone]']
              }
            };
            var username = req.body['data[' + i + '][username]'];
            Employee.update(name, username, up, function (err, employee) {
              if (err) {
                return res.json(err);
              }
            });
          }
          else if (req.body['data[' + i + '][op]'] == 'delete') {
            var username = req.body['data[' + i + '][username]'];
             mongodb.open(function (err, db) {
               db.collection(name + '_employees', function (err, collection) {
                 collection.remove({'username': username}, function (err) {
                    mongodb.close();
                  });
               });
               mongodb.close();
              });
          }
        }
      }
    }
    return res.json('success');
  });


  app.use(function (req, res) {    //获取css,js,img
    return res.sendFile(__dirname + '../public' + req.url);
  });
}
