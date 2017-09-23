var mongoose = require('mongoose');

//schema
var OriginalSchema = new mongoose.Schema({
  "key": String,
  "val": {
    type: Number,
    default: 0
  },
});

//model
var Count = mongoose.model("count", OriginalSchema);


// Count.create({
//   "key": 'visit',
//   "val": 0,
// })
// .then(function (data) {
//   console.log(data);
// });

module.exports = Count;



