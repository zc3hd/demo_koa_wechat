var mongoose = require('mongoose');

//schema
var UserSchema = new mongoose.Schema({
  "name": String,
  "password": String,
  "user_id": String,
});

//model
var User = mongoose.model("user", UserSchema);


// 超级管理员
// User.create({
//   "name": 'cc',
//   "password": 'e10adc3949ba59abbe56e057f20f883e',
//   "user_id": 'olquvwBA1Kk4ZEJwTuxwiXAmO7js'
// })
// .then(function (data) {
// 	console.log(data);
// });


  // User.findOne({"name":"admin"}, function(err, docs) {
  // 	console.log(docs);
  // 	docs.powers = [0,1,2,4];
  // 	docs.save();
  // });

// UserSchema.methods.test = function () {
// 	console.log('asd');
// };

// var asd = new User({
// 	"name": 'String',
//   "password": 111234,
//   "course": [0],
//   "powers": [2,3]
// });

// asd.test();

module.exports = User;