var mongodb = require('./db');

function Order(order) {
    this.id = order.id;
    this.streamid = order.streamid;
    this.owner = order.owner;
    this.menu_name = order.menu_name;
    this.number = order.number;
    this.singleprice = order.singleprice;
    this.taste = order.taste;                   //评价---口味
    this.speedOfProduction = order.speedOfProduction;    //评价---上菜速度
    this.serviceAttitude = order.serviceAttitude;       //评价---服务态度
    this.totalEvaluation = order.totalEvaluation;       //评价---总评价
    this.cost = order.cost;
    this.price = order.price;
    this.state = order.state;
};

// Order.prototype.save = function (callback) {
//     //要存入数据库的用户文档
//     var order = {
//         id: this.id,
//         streamid:this.streamid,
//         owner: this.owner,
//         menu_name:this.menu_name,
//         taste:this.taste,
//         speedOfProduction:this.speedOfProduction,
//         serviceAttitude:this.serviceAttitude,
//         totalEvaluation: this.totalEvaluation,
//         cost: this.cost,
//         price: this.price,
//         state: this.state
//     };
//     //打开数据库
//     mongodb.open(function (err, db) {
//         if (err) {
//             return callback(err);//错误，返回 err 信息
//         }
//         //读取 users 集合
//         db.collection(owner+'_orders', function (err, collection) {
//             if (err) {
//                 mongodb.close();
//                 return callback(err);//错误，返回 err 信息
//             }
//             //将用户数据插入 users 集合
//             collection.insert(order, {safe: true}, function (err, order) {
//                        mongodb.close();
                
//                 //成功！err 为 null，并返回存储后的用户文档
//                 return err ? callback(err) : callback(null, order.ops[0]);
//             });
//         });
//     });
// };

//读取用户信息
Order.get = function (owner, streamid, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection(owner+'_orders', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({streamid: streamid}, function (err, order) {
                mongodb.close();
                return err ? callback(err) : callback(null,order);
            });
        });
    });
};

Order.update = function (owner, streamid, up, callback) {
    console.log("222");
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        console.log("333");
        db.collection('qqqqqq_orders', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            console.log("444");
            collection.update({streamid: streamid}, up, function (err) {
                if(err) {
                    console.log("666");
                }
                console.log("555");
                mongodb.close();
            });
        });
    });
};
module.exports = Order;
