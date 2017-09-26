var mongoose = require('mongoose');

//schema
var OriginalSchema = new mongoose.Schema({
  "key": String,
  "val": String,
  "expires_in": {
    type: Number,
    default: 0
  },
});

//model
var Conf = mongoose.model("conf", OriginalSchema);


// Conf.create({
//   "key": 'pay',
//   "val": "50",
// })
// .then(function (data) {
//   console.log(data);
// });
// Count.create({
//   "key": 'num',
//   "val": 0,
// })
// .then(function (data) {
//   console.log(data);
// });

// Count.create({
//   "key": 'vote',
//   "val": 0,
// })
// .then(function (data) {
//   console.log(data);
// });


module.exports = Conf;



