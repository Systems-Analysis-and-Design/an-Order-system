var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var multer = require('multer');
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
    else if(op == 'managerLogin') {
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
    else if(op == 'employeeLogin') {
      //员工登录
     console.log(req.body);
      var owner1 = req.body.managerUsername;
      var name1 = req.body.username;
      var password1 = req.body.password;
      mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        db.collection(owner1+"_employees", function (err, collection1) {
          if (err) {
            mongodb.close();
            return callback(err);//错误，返回 err 信息
          }

          collection1.findOne({username: name1}, function (err, employee) {
            if (err) {
              return res.json(err);
            }
            else if (employee) {
              if(employee.password == password1){
                return res.json("success");
              }
              else {
                return res.json("wrongPassword");
              }
            }
            else {
              return res.json("notFound");
            }
            mongodb.close();
          });
        });
        mongodb.close(); 
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
            
           var name = req.session.user.name;
            var show = new Object();
            show.name = name;
            mongodb.open(function (err, db) {
              //读取 users 集合
              db.collection(name + '_menu', function (err, collection) {
                var query = {};
                var amount;
                collection.count(query, function (err, total) {
                  amount = total;
                  // console.log(amount);
                });
                var menus = new Array();
                collection.find().toArray(function (err, result) {
                  for (var i = 0; i < amount; i++) {
                    var item = new Object();
                    item.name = result[i].name;
                    item.class = result[i].class;
                    item.imgSrc = result[i].imgSrc;
                    item.ingredients = result[i].ingredients;
                    item.cost = result[i].cost;
                    item.price = result[i].price;
                    menus[i] = item;
                  }
                  return res.render('info-' + req.query.info, { user: show, menu: menus });
                  mongodb.close();
                });
              });
              mongodb.close();
            });
          }

          else if (info == 'ingredients') {
            var name = req.session.user.name;
            var show = new Object();
            show.name = name;
            mongodb.open(function (err, db) {
              db.collection(name + '_ingredients', function (err, collection) {
                var query = {};
                var amount;
                collection.count(query,function (err, total) { 
                  amount = total;
                });
                var ingredients = new Array();
                collection.find().toArray(function (err, result) {
                  for (var i = 0; i < amount; i++) {
                    var item = new Object();
                    //item.id = (i+1).toString();
                    item.name = result[i].name;
                    item.price = result[i].price;
                    item.cost = result[i].cost;
                    item.stock = result[i].stock;
                    ingredients[i] = item;
                  }
                  return res.render('info-' + req.query.info, { user:show, ingredients: ingredients });
                  mongodb.close();
                });
              });
              mongodb.close();
            });
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
                    item.imgSrc = result[i].imgSrc;
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
 var upload = multer({ dest: 'public/images/upload' });

  //修改表单
  app.post('/user', upload.single('img'), function (req, res, next) {
    // Test
    var info = req.query.info;
    var op1 = req.query.op;
    if (op1 == 'uploadImg') { 
      var filename = req.file.originalname;
      var mime = filename.split('.').pop();
      //使用新文件名 防止图片文件名相同 
      fs.renameSync('./public/images/upload/' + req.file.filename, './public/images/upload/' + req.file.filename + '.' + mime); 
      var newpath = 'images/upload/' + req.file.filename + '.' + mime;

      console.log(newpath);
      return res.json(newpath);
    }
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
          imgSrc: '',
          username: req.body.username,
          password: req.body.password,
          name: req.body.name,
          age: req.body.age,
          phone: req.body.phone,
          post: req.body.post
        });
        //检查用户名是否已经存在
        mongodb.open(function (err, db) {
          if (err) {
            mongodb.close();
            return callback(err);//错误，返回 err 信息
          }
          //读取 employees 集合
          db.collection(newEmployee.owner + '_employees', function (err, collection) {
            if (err) {
              mongodb.close();
              return callback(err);//错误，返回 err 信息
            }
            //查找账户（值为 account 一个文档
            collection.insert(newEmployee, { safe: true }, function (err, employee) {
              mongodb.close();
            });
          });
          mongodb.close();
        });
      }
      else if (op == 'save') {
        var up = req.body;
        var name1 = req.query.username;
        Employee.gg(name1, up, function (err) {
          // if (err) {
          //   return res.json(err);
          // }
        });   
      }
    }
     else if (info == 'menu') {
      var name = req.query.username;
      var up = req.body;
      Menu.gg(name, up, function (err) {
        if (err) {
           return res.json(err);
         }
      });
    }
    else if(info == 'ingredients'){
      var up = req.body;
      console.log(up);
      Ingredient.operation(req.query.username, up, function (err) {
        if (err) {
           return res.json(err);
         }
      });
    }
    return res.json('success');
  });
  
  app.get('/employee', function(req, res, next) {
    var paidOrder = new Array();
    var item = new Object();
    item.orderNumber = "0002";
    item.name = "咸鱼煲汤";
    item.tabelNumber = 12;
    item.note = "不要鱼，加辣";
    paidOrder[0] = item;
    return res.render('employee-chef', {paidOrder: paidOrder});
  });

  app.post('/employee', function(req, res, next) {
    console.log(req.body);
    res.json("success");
  });

  app.use(function (req, res) {    //获取css,js,img
    return res.sendFile(__dirname + '../public' + req.url);
  });
}
