'use strict';
var Koa = require('koa');

var path = require('path');
// 静态服务器
var staticServer = require('koa-static');

// -------------------------------------2017-8-25
// // 微信服务器验证我们
// var wx = require('./wechat/wx.js');
// // 配置项
// var conf = require('./wechat/config.js');
// // router

// var app = new Koa();

// // 
// app.use(wx(conf));


// -------------------------------------2017-8-29

var app = new Koa();

// 静态文件
app.use(staticServer(path.join(__dirname, './webapp')));

// 和微信服务器的交互
var wx = require('./routes_controllers/wx/route.js');
app.use( wx.routes(), wx.allowedMethods());




app.listen(1234, function() {
  console.log('on 1234');
});
