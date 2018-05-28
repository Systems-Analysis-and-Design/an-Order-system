var mongodb = require('./db');

function Menu(menu) {
    this.owner = menu.owner;
    this.name = menu.name;
    this.ingredients = menu.ingredients;
    this.cost = menu.cost;
    this.price = menu.price;
};

Menu.gg = function (name, up, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);//错误，返回 err 信息
        }
        db.collection(name + '_menu', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            var arr = Object.keys(up);
            var len = arr.length / 5;
           for (var i = 0; i < len; i++) {
                var menuname1 = up['data[' + i + '][name]'];
                var ingredients1 = up['data[' + i + '][ingredients]'];
                var cost1 = up['data[' + i + '][cost]'];
                var price1 = up['data[' + i + '][price]'];

                if (up['data[' + i + '][op]'] == 'save') {

                    collection.findOne({ name: menuname1 }, function (err, menu) {
                        if (menu) {
                            var up1 = {
                                $set: {
                                    'ingredients': ingredients1,
                                    'cost': cost1,
                                    'price': price1
                                }
                            };
                            collection.update({ 'name': menuname1 }, up1, function (err) {
                                if (err) {
                                    return callback(err);//错误，返回 err 信息
                                }
                            });
                        }
                        else {
                            var newMenu = new Menu({
                                owner: name,
                                name: menuname1,
                                ingredients: ingredients1,
                                cost: cost1,
                                price: price1
                            });
                            collection.insert(newMenu, { safe: true }, function (err) {
                                console.log(newMenu);
                                if (err) {
                                    console.log(err);
                                    return callback(err);//错误，返回 err 信息
                                }
                              //  console.log('2');
                            });
                        }
                    });
                }
                else if (up['data[' + i + '][op]'] == 'delete') {
                    collection.remove({ 'name': menuname1 }, function (err) { });
               }
               if (i == len - 1) {
                   setTimeout(function () {
                       mongodb.close();
                   }, 500);
                   
               }
            }
            
        });
       
    });
};


module.exports = Menu;
