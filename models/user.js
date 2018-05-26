var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.phone = user.phone;
    this.email = user.email;
    this.storeName = user.storeName;
    this.storeAddress = user.storeAddress;
};

//存储用户信息
User.prototype.save = function (callback) {
    //要存入数据库的用户文档
    var user = {
        name: this.name,
        password: this.password,
        phone:this.phone,
        email: this.email,
        storeName: this.storeName,
        storeAddress: this.storeAddress
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.insert(user, {safe: true}, function (err, user) {
                mongodb.close();
                //成功！err 为 null，并返回存储后的用户文档
                return err ? callback(err) : callback(null, user.ops[0]);
            });
        });
    });
};

//读取用户信息
User.get = function (name, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({name: name}, function (err, user) {
                mongodb.close();
                return err ? callback(err) : callback(null, user);
            });
        });
    });
};

module.exports = User;
