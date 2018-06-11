var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var multer = require('multer');
var User = require('../models/user');
var Menu = require('../models/menu');
var Order = require('../models/order');
var Employee = require('../models/employee');
var Ingredient = require('../models/ingredient');
var mongodb = require('../models/db');

var upload = multer({ dest: 'public/images/upload' });
var count = 0;
module.exports = function(app) {

  //渲染后台管理主页
  app.get('/', function(req, res, next) {
    res.render('home', { title: '皮皮怪点餐' });
  });

  //点餐请求处理
  app.get('/*/client', function(req, res, next) {
    var name = req.url.split('/')[1];
    var show = new Object();
    show.name = name;
    //从数据口中获取菜品信息传入前台显示
    mongodb.open(function(err, db) {
      db.collection(name + '_menu', function(err, collection) {
        var query = {};
        var amount;
        collection.count(query, function(err, total) {
          amount = total;
        });
        var menus = new Array();
        collection.find().toArray(function(err, result) {
          for (var i = 0; i < amount; i++) {
            var item = new Object();
            item.imgSrc = result[i].imgSrc;
            item.class = result[i].class;
            item.name = result[i].name;
            item.ingredients = result[i].ingredients;
            item.cost = result[i].cost;
            item.price = result[i].price;
            menus[i] = item;
          }
          return res.render('client', {username: name, user: show, menu: menus });
          mongodb.close();
        });
      });
      mongodb.close();
    });
  });

  //订单提交处理
  app.get('/*/handin', function (req, res, next) {
    var name = req.url.split('/')[1];
    var finish = req.query.finish;
    if(finish == 'true'&&count == 1) {
      count = 0;
      return res.render('order_finish');
    }
    var sid = parseInt(req.query.id);
    //从数据库中获取订单信息
    Order.get(name, sid, function(err, order){
      var ordersss = new Array();
      var totalprice = 0;
      if(order) {
        var itemcount =  order.menu_name.length;
        for (var i = 0; i < itemcount; i++) {
          var item = new Object();
          item.name = order.menu_name[i];
          item.number = order.number[i];
          item.price = order.singleprice[i];
          ordersss[i] = item;
        }
        totalprice = order.price;
      }
      mongodb.close(); 
      return res.render('order_detail', { order: ordersss, totalprice: totalprice });
    });     
  });

  //根据菜品选择结果生成订单，存入数据库
  app.post('/*/client', function (req, res) {
    var bossname = req.url.split('/')[1];
    var tableID = req.query.tableID;
    var up = req.body;
    var arr = Object.keys(req.body);
    var len = arr.length / 4;
    var name = new Array();
    var number = new Array();
    var singleprice = new Array();
    var totalcost = 0;
    var totalprice = 0;
    //获取前端传入到后台的表单信息
    for (var i = 0; i < len; i++) { 
      name[i] = up['data['+ i +'][name]'];
      number[i] = parseInt(up['data['+ i +'][num]']);
      singleprice[i] = parseInt(up['data['+ i +'][price]']);
      totalcost += parseInt(up['data[' + i + '][cost]']) * number[i];
      totalprice += parseInt(up['data[' + i + '][price]']) * number[i];
    }
    //随机数生成订单号
    var sid = Math.floor(Math.random()*100000);
    var neworder = new Order({
      id: tableID,
      streamid: sid,
      owner: bossname,
      menu_name: name,
      number: number,
      singleprice: singleprice,
      taste:'',
      speedOfProduction:'',
      serviceAttitude:'',
      totalEvaluation:'',
      cost: totalcost,
      price: totalprice,
      state: '0'
    });
    //打开数据库将订单信息写入数据库表项中
    mongodb.open(function(err, db) {
      if (err) {
        mongodb.close();
        //打开数据库错误，返回 err 信息
        return callback(err); 
      }
      db.collection(neworder.owner+'_orders', function(err, collection) {
        if (err) {
          mongodb.close();
          return callback(err); 
        }
        //插入新建的订单到数据库
        collection.insert(neworder, { safe: true }, function(err, order) {
          mongodb.close();
          var data = new Array();
          data[0] = neworder.streamid;
          data[1] = neworder.id;
          return res.json(data);
        });   
      });
      mongodb.close();
    });
  });

  //后台处理评价信息
  app.post('/*/handin', function (req, res){
    var finish = req.query.finish;
    if(finish == 'true') {
      var sid = parseInt(req.query.id);
      var owner = req.url.split('/')[1];
      //获取前台用户提交的评价信息
      var up = {
        $set: {
          'taste': req.body.taste,
          'speedOfProduction': req.body.speedOfProduction,
          'serviceAttitude':req.body.serviceAttitude,
          'totalEvaluation':req.body.totalEvaluation
        }
      };
      //将评价信息更新到后台的数据库中
      Order.update(owner,sid, up, function (err, order) {
        if (err) {
          return res.json(err);
        }
      });
      return res.json("secess");
    }
    count = 1;
    return res.json("secess");
  });

  //系统后台管理登录/注册功能的实现
  app.post('/', function (req, res) {
    var op = req.query.op;
    var info = req.query.info;
    //进行密码加密
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');
    //店主注册功能实现
    if (op == 'regist') {
      var newUser = new User({
        name: req.body.username,
        password: password,
        phone: req.body.phone,
        email: req.body.email,
        storeName: req.body.storeName,
        storeAddress:req.body.storeAddress
      });
      //检查注册用户名是否已经存在 
      User.get(newUser.name, function (err, user) {
        if (err) {
          return res.json(err);
        }
        //如用户名已存在，则不能注册
        if (user) {
          return res.json("exited");
        }
        //如用户名不存在，则成功注册
        newUser.save(function (err, user) {
          if (err) {
            return res.json(err);
          }
          req.session.user = user;
          return res.json("success");
        });
      });
    }
    //店主登录处理
    else if(op == 'managerLogin') {
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
          //如登录时密码错误，返回相应信息
          else {
            return res.json("wrongPassword");
          }
        }
        //如登录时用户名不存在，则返回相应信息
        else {
          return res.json("notFound");
        }
      });
    }
    //员工登录处理
    else if(op == 'employeeLogin') {
      var owner1 = req.body.managerUsername;
      var name1 = req.body.username;
      var password1 = req.body.password;
      mongodb.open(function (err, db) {
        if (err) {
          return callback(err);
        }
        db.collection(owner1+"_employees", function (err, collection1) {
          if (err) {
            mongodb.close();
            return callback(err);
          }
          collection1.findOne({username: name1}, function (err, employee) {
            if (err) {
              return res.json(err);
            }
            else if (employee) {
              if(employee.password == password1){
                return res.json("success");
              }
              //如登录时密码错误，返回相应信息
              else {
                return res.json("wrongPassword");
              }
            }
            //如登录时用户名不存在，则返回相应信息
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

  //系统后台管理页显示
  app.get('/user', function(req, res, next) {
    var op = req.query.op;
    var info = req.query.info;
    if (op == "logout") {
      req.session.user = null;
      return res.redirect('/');
    }
    else {
      if (req.session.user) {
          //防止通过改url访问他人数据
        if (req.session.user.name == req.query.username && req.query.info) {
          //显示店主个人信息
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
          //显示数据库中已有的菜品信息
          else if (info == 'menu') {
            var name = req.session.user.name;
            var show = new Object();
            show.name = name;
            mongodb.open(function (err, db) {
              //打开数据库获取菜品信息
              db.collection(name + '_menu', function (err, collection) {
                var query = {};
                var amount;
                collection.count(query, function (err, total) {
                  amount = total;
                });
                var menus = new Array();
                //将获取到的菜品信息传至前端
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
          //显示数据库中已有的食材信息
          else if (info == 'ingredients') {
            var name = req.session.user.name;
            var show = new Object();
            show.name = name;
            //打开数据库获取食材信息
            mongodb.open(function (err, db) {
              db.collection(name + '_ingredients', function (err, collection) {
                var query = {};
                var amount;
                collection.count(query,function (err, total) { 
                  amount = total;
                });
                var ingredients = new Array();
                //将获取到的食材信息传至前端
                collection.find().toArray(function (err, result) {
                  for (var i = 0; i < amount; i++) {
                    var item = new Object();
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
           //显示数据库中已有的订单评价信息
          else if (info == 'evaluation') {
            var name = req.session.user.name;
            var show = new Object();
            show.name = name;
            //打开数据库获取订单评价信息
            mongodb.open(function (err, db) {
              db.collection(name + '_orders', function (err, collection) {
                var query = {};
                var amount;
                collection.count(query,function (err, total) { 
                  amount = total;
                });
                var evaluation = new Array();
                //将获取到的订单评价信息传至前端
                collection.find().toArray(function (err, result) {
                  for (var i = 0; i < amount; i++) {
                    if(result[i].taste!='' ||result[i].speedOfProduction!=''||result[i].serviceAttitude!=''||result[i].totalEvaluation!=''){
                      var item = new Object();
                      item.serialNumber = result[i].streamid;
                      var detal='';
                      for(var j =0;j<result[i].menu_name.length;j++){
                        if(j !=result[i].menu_name.length-1){
                          detal = detal +  result[i].menu_name[j] +", ";
                        }
                        else{
                          detal = detal +  result[i].menu_name[j];
                        }
                      }
                      item.orderDetails = detal;
                      item.taste = result[i].taste;
                      item.speedOfProduction = result[i].speedOfProduction;
                      item.serviceAttitude = result[i].serviceAttitude;
                      item.totalEvaluation = result[i].totalEvaluation;
                      evaluation[i] = item;
                    }
                  }
                  return res.render('info-' + req.query.info, { user:show, evaluation: evaluation });
                  mongodb.close();
                });
              });
              mongodb.close();
            });
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
            var name = req.session.user.name;
            var show = new Object();
            show.name = name;
            mongodb.open(function (err, db) {
              //读取 users 集合
              db.collection(name + '_orders', function (err, collection) {
                var query = {};
                var amount;
                collection.count(query,function (err, total) { 
                  amount = total;
                 // console.log(amount);
                });
                var accountsIn = new Array();
                var accountsOut = new Array();
                collection.find().toArray(function (err, result) {
                  for (var i = 0; i < amount; i++) {
                    var itemIn = new Object();
                    itemIn.name = result[i].streamid;
                    itemIn.cost = result[i].cost;
                    itemIn.income = result[i].price;
                    itemIn.netIncome = result[i].price -result[i].cost;
                    accountsIn[i] = itemIn;
                  }
                  return res.render('info-' + req.query.info, { user:show, accountsIn: accountsIn});
                  mongodb.close();
                });
              });
              mongodb.close();
            });
          }
        }
        else return res.redirect('/user?username=' + req.session.user.name + '&info=personal');
      }
    }
  });

  //修改表单
 

  //后台管理表单修改处理
  app.post('/user', upload.single('img'), function (req, res, next) {
    // Test
    var info = req.query.info;
    var op1 = req.query.op;
    //实现图片上传功能
    if (op1 == 'uploadImg') { 
      var filename = req.file.originalname;
      var mime = filename.split('.').pop();
      //使用新文件名 防止图片文件名相同 
      fs.renameSync('./public/images/upload/' + req.file.filename, './public/images/upload/' + req.file.filename + '.' + mime); 
      var newpath = 'images/upload/' + req.file.filename + '.' + mime;
      return res.json(newpath);
    }
    //修改店铺信息
    if (info == 'personal-store') {
      var name = req.query.username;
      var up = {
        $set: {
          'storeName': req.body.storeName,
          'storeAddress': req.body.storeAddress
        }
      };
      //更新数据库中的店主店铺信息
      User.update(name, up, function (err, user) {
        if (err) {
          return res.json(err);
        }
      });
    }
    //修改店主账号信息
    else if (info == 'personal-account') {
      var name = req.query.username;
      var up = {
        $set: {
          'phone': req.body.phone,
          'email': req.body.email
        }
      };
      //将店主账号信息更新到数据库
      User.update(name, up, function (err, user) {
        if (err) {
          return res.json(err);
        }
      });
    }
    //实现员工信息的修改，添加以及删除
    else if (info == 'employee') {
      var op = req.query.op;
      var name = req.query.username;
      //添加员工账户
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
        //打开数据库
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
            //插入新的员工账号
            collection.insert(newEmployee, { safe: true }, function (err, employee) {
              mongodb.close();
            });
          });
          mongodb.close();
        });
      }
      //实现修改员工账户信息以及实现删除
      else if (op == 'save') {
        var up = req.body;
        var name1 = req.query.username;
        Employee.gg(name1, up, function (err) {
          
        });   
      }
    }
    //实现菜品信息的修改，添加以及删除
     else if (info == 'menu') {
      var name = req.query.username;
      var up = req.body;
      Menu.gg(name, up, function (err) {
        if (err) {
           return res.json(err);
         }
      });
    }
    //实现食材信息的修改，添加以及删除
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
  
  //厨师界面，获取订单信息
  app.get('/employee', function(req, res, next) {
    var managername = req.query.managername;
    mongodb.open(function (err, db) {
      db.collection(managername + '_orders', function (err, collection) {
        var query = {};
        var amount;
        collection.count(query, function (err, total) {
          amount = total;
        });
        var paidOrder = new Array();
        //在订单数据库中获取订单
        collection.find().toArray(function (err, result) {
          //将未制作的订单传到前端
          for (var i = 0; i < amount; i++) {
            if (result[i].state == '0') {
              var item = new Object();
              item.orderNumber = result[i].streamid;
              item.tabelNumber = result[i].id;
              var sss = '';
              for (var j = 0; j < result[i].menu_name.length; j++) {
                if (j != result[i].menu_name.length-1)
                  sss += result[i].menu_name[j] + 'x' + result[i].number[j] + '、 ';
                else sss += result[i].menu_name[j] + 'x' + result[i].number[j];
              }
              item.name = sss;
              paidOrder[i] = item;
            }
          }
          return res.render('employee-chef', { paidOrder: paidOrder });
          mongodb.close();
        });
      });
      mongodb.close();
    });
  });

  //厨师修改订单状态
  app.post('/employee', function (req, res, next) {
    var managername = req.query.managername;
    console.log(managername);
    var streamid = parseInt(req.body.orderNumber);
      var up = {
        $set: {
          "state": "1"
        }
      };
      //更新订单信息到数据库中
      Order.update(managername, streamid, up, function (err, order) {
        if (err) {
          return res.json(err);
        }
      });
    return res.json("success");
  });


  app.use(function (req, res) {    //获取css,js,img
    return res.sendFile(__dirname + '../public' + req.url);
  });
}
