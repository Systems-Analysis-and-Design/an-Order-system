var mongodb = require('./db');

function Ingredient(ingredient) {
    this.owner = ingredient.owner;
    this.name = ingredient.name;
    this.price = ingredient.price;
    this.cost = ingredient.cost;
    this.stock = ingredient.stock; 
};

//存储用户信息
Ingredient.prototype.save = function (callback) {
    //要存入数据库的用户文档
    var ingredient = {
        owner:this.owner,
        name: this.name,
        price: this.price,
        cost:this.cost,
        stock: this.stock
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection(ingredient.owner + '_ingredients', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.insert(ingredient, {safe: true}, function (err, ingredient) {
                mongodb.close();
                //成功！err 为 null，并返回存储后的用户文档
                return err ? callback(err) : callback(null, ingredient.ops[0]);
            });
        });
    });
};

//读取用户信息
Ingredient.get = function (name, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection(ingredient.owner + '_ingredients', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({name: name}, function (err, user) {
                mongodb.close();
                return err ? callback(err) : callback(null, ingredient);
            });
        });
    });
};

Ingredient.update = function (name, up, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        db.collection(ingredient.owner + '_ingredients', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.update({'name': name}, up, function (err) {
                mongodb.close();
            });
        });
    });
};

module.exports = Ingredient;
