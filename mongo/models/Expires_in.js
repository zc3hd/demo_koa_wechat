var mongoose = require('mongoose');
//schema
var _Schema = new mongoose.Schema({
  "key": String,
  "val": String,
  "expires_in": Number,
});
//model
// 所有的素材存放在这
var Expires_in = mongoose.model("expires_in", _Schema);

module.exports = Expires_in;


// Expires_in.create({
//     "key": "access_token",
//     "val": "dytcsNLwg9xZhFIaHLzcTzIlS9ArXcRipPLFngMh0z6j66BhFLTc6yLO1EK9UOkII1f0tnOlBfqPNihop_Jiv0v8D63VxVCHPWR_W2O4GpUMHZgACAVQI",
//     "expires_in": 1504667581905,
//   })
//   .then(function(data) {
//     console.log(data);
//   });

// Expires_in.create({
//     "key": "ticket",
//     "val": "kgt8ON7yVITDhtdwci0qeVVAbk2MIUyiASW5J0t2qcUbgjwJ1njHllVHd__3KRXHSYDKB1u8fb8SHskoe2phnA",
//     "expires_in": 1504667582062,
//   })
//   .then(function(data) {
//     console.log(data);
//   });

