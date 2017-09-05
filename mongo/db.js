var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var conf = require('../wechat/config.js');
mongoose.connect('mongodb://localhost/'+conf.app.db);

var db = mongoose.connection;

module.exports = db;