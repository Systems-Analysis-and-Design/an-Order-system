var mongodb = require('./db');

function Ingredient(ingredient) {
    this.owner = ingredient.owner;
    this.name = ingredient.name;
    this.price = ingredient.price;
    this.cost = ingredient.cost;
    this.stock = ingredient.stock; 
};

Ingredient.operation = function(owner, up, callback) {
     mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);//错误，返回 err 信息
        }
        db.collection(owner + '_ingredients', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            var arr = Object.keys(up);
            var len = arr.length / 5;
           for (var i = 0; i < len; i++) {
                (function(i){
                    var name = up['data[' + i + '][name]'];
                    var price = up['data[' + i + '][price]'];
                    var cost = up['data[' + i + '][cost]'];
                    var stock = up['data[' + i + '][stock]'];
                    if (up['data[' + i + '][op]'] == 'save') {
                        collection.findOne({ name: name }, function (err, ingredient) {
                            if (ingredient) {
                                var up1 = {
                                    $set: {
                                        'price': price,
                                        'cost': cost,
                                        'stock': stock
                                    }
                                };
                                collection.update({ 'name': name }, up1, function (err) {
                                        if (err) {
                                            return callback(err);//错误，返回 err 信息
                                        }
                                    });
                                }
                                else {
                                    var newIngredient = new Ingredient({
                                        owner: owner,
                                        name: name,
                                        price: price,
                                        cost: cost,
                                        stock: stock
                                    });
                                    collection.insert(newIngredient, { safe: true }, function (err) {
                                        if (err) {
                                            return callback(err);//错误，返回 err 信息
                                        }
                                    });
                                }
                            });
                        }
                        else if (up['data[' + i + '][op]'] == 'delete') {
                            collection.remove({ 'name': name }, function (err) { });
                       }
                       if (i == len - 1) {
                           setTimeout(function () {
                               mongodb.close();
                           }, 500); 
                       }
               })(i);
            }  
        });
    });
};

module.exports = Ingredient;

