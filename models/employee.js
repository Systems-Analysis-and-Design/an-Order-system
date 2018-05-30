var mongodb = require('./db');

function Employee(employee) {
    this.owner = employee.owner;
    this.imgSrc = employee.imgSrc;
    this.username = employee.username;
    this.password = employee.password;
    this.name = employee.name;
    this.age = employee.age;
    this.phone = employee.phone;
    this.post = employee.post;
};


Employee.gg = function (name, up, callback) { 
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        db.collection(name + '_employees', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            var arr = Object.keys(up);
            var len = arr.length / 7;
            for (var i = 0; i < len; i++) { 
                console.log(up);

                var img1 = up['data[' + i + '][imgSrc]'];
                var username1 = up['data[' + i + '][username]'];
                var name1 = up['data[' + i + '][name]'];
                var age1 = up['data[' + i + '][age]'];
                var phone1 = up['data[' + i + '][phone]'];
                var post1 = up['data[' + i + '][post]'];
                if (up['data[' + i + '][op]'] == 'save') {
                    var up1 = {
                        $set: {
                            'imgSrc': img1,
                            'post': post1,
                            'name': name1,
                            'age': age1,
                            'phone':phone1
                        }
                    };
                    collection.update({ 'username': username1 }, up1, function (err) {
                        if (err) {
                            return res.json(err);
                        }
                    });
                }
                else if (up['data[' + i + '][op]'] == 'delete') {
                            collection.remove({ 'username': username1 }, function (err) {});
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


module.exports = Employee;
