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

Order.get = function (owner, streamid, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }

        db.collection(owner+'_orders', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.findOne({streamid: streamid}, function (err, order) {
                mongodb.close();
                return err ? callback(err) : callback(null,order);
            });
        });
    });
};

Order.update = function (owner, streamid, up, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        db.collection(owner+'_orders', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.update({streamid: streamid}, up, function (err) {
                if(err) {
                }
                mongodb.close();
            });
        });
    });
};
module.exports = Order;







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

Order.get = function (owner, streamid, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }

        db.collection(owner+'_orders', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.findOne({streamid: streamid}, function (err, order) {
                mongodb.close();
                return err ? callback(err) : callback(null,order);
            });
        });
    });
};

Order.update = function (owner, streamid, up, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        db.collection(owner+'_orders', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.update({streamid: streamid}, up, function (err) {
                if(err) {
                }
                mongodb.close();
            });
        });
    });
};
module.exports = Order;
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

Order.get = function (owner, streamid, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }

        db.collection(owner+'_orders', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.findOne({streamid: streamid}, function (err, order) {
                mongodb.close();
                return err ? callback(err) : callback(null,order);
            });
        });
    });
};

Order.update = function (owner, streamid, up, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        db.collection(owner+'_orders', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.update({streamid: streamid}, up, function (err) {
                if(err) {
                }
                mongodb.close();
            });
        });
    });
};
module.exports = Order;
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

Order.get = function (owner, streamid, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }

        db.collection(owner+'_orders', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.findOne({streamid: streamid}, function (err, order) {
                mongodb.close();
                return err ? callback(err) : callback(null,order);
            });
        });
    });
};

Order.update = function (owner, streamid, up, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        db.collection(owner+'_orders', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.update({streamid: streamid}, up, function (err) {
                if(err) {
                }
                mongodb.close();
            });
        });
    });
};
module.exports = Order;
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

Order.get = function (owner, streamid, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }

        db.collection(owner+'_orders', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.findOne({streamid: streamid}, function (err, order) {
                mongodb.close();
                return err ? callback(err) : callback(null,order);
            });
        });
    });
};

Order.update = function (owner, streamid, up, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        db.collection(owner+'_orders', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.update({streamid: streamid}, up, function (err) {
                if(err) {
                }
                mongodb.close();
            });
        });
    });
};
module.exports = Order;
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

Order.get = function (owner, streamid, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }

        db.collection(owner+'_orders', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.findOne({streamid: streamid}, function (err, order) {
                mongodb.close();
                return err ? callback(err) : callback(null,order);
            });
        });
    });
};

Order.update = function (owner, streamid, up, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        db.collection(owner+'_orders', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.update({streamid: streamid}, up, function (err) {
                if(err) {
                }
                mongodb.close();
            });
        });
    });
};
module.exports = Order;
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

Order.get = function (owner, streamid, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }

        db.collection(owner+'_orders', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.findOne({streamid: streamid}, function (err, order) {
                mongodb.close();
                return err ? callback(err) : callback(null,order);
            });
        });
    });
};

Order.update = function (owner, streamid, up, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        db.collection(owner+'_orders', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.update({streamid: streamid}, up, function (err) {
                if(err) {
                }
                mongodb.close();
            });
        });
    });
};
module.exports = Order;

