var mongodb = require('./db');

function Menu(menu) {
    this.owner = menu.owner;
    this.name = menu.name;
    this.ingredients = menu.ingredients;
    this.cost = menu.cost;
    this.price = menu.price;
};


Menu.prototype.save = function (callback) {

    var menu = {
        owner:this.owner,
        name: this.name,
        ingredients: this.ingredients,
        cost: this.cost,
        price: this.price
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 menu 集合
        db.collection(menu.owner+'_menu', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将数据插入 menu 集合
            collection.insert(menu, { safe: true }, function (err, user) {
                mongodb.close();
                //成功！err 为 null，并返回存储后的用户文档
                return err ? callback(err) : callback(null, menu.ops[0]);
            });
        });
    });
};

//读取信息
Menu.get = function (name, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 menu 集合
        db.collection(menu.owner+'_menu', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找值为 name 一个文档
            collection.findOne({ name: name }, function (err, menu) {
                mongodb.close();
                return err ? callback(err) : callback(null, menu);
            });
        });
    });
};

module.exports = Menu;
