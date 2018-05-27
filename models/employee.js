var mongodb = require('./db');

function Employee(employee) {
	this.owner = employee.owner;
    this.username = employee.username;
    this.password = employee.password;
    this.name = employee.name;
    this.age = employee.age;
    this.phone = employee.phone;
    this.post = employee.post;
};

Employee.prototype.save = function (callback) {
    //要存入数据库的用户文档
    var employee = {
        owner: this.owner,
    	username: this.username,
        password: this.password,
        name: this.name,
        age: this.age,
        phone:this.phone,
        post: this.post
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        db.collection(employee.owner + '_employees', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将员工数据插入 employees 集合
            collection.insert(employee, {safe: true}, function (err, employee) {
                mongodb.close();
                //成功！err 为 null，并返回存储后的用户文档
                return err ? callback(err) : callback(null, employee.ops[0]);
            });
        });
        mongodb.close();
    });
    
};

//读取员工信息
Employee.get = function (name, username, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 employees 集合
        db.collection(name + '_employees', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找账户（值为 account 一个文档
            collection.findOne({username: username}, function (err, employee) {
                mongodb.close();
                return err ? callback(err) : callback(null, employee);
            });
        });
        mongodb.close();
    });
    
};

Employee.update = function (name,username, up, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        db.collection(name + '_employees', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.update({ 'username':username }, up, function (err) {
                mongodb.close();
            });
        });
        mongodb.close();
    });
    
};

module.exports = Employee;
