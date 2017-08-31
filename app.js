'use strict';
var Koa = require('koa');

var path = require('path');
// 静态服务器
var staticServer = require('koa-static');
var bodyparser = require('koa-bodyparser')

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

app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));
// 静态文件
app.use(staticServer(path.join(__dirname, './webapp')));


// 前端数据的后台打印显示
var web_console_test = require('./routes_controllers/web_console/route.js');
app.use(web_console_test.routes(), web_console_test.allowedMethods());

// 和微信服务器的交互
var wx = require('./routes_controllers/wx/route.js');
app.use(wx.routes(), wx.allowedMethods());

// sdk
var sdk_init = require('./routes_controllers/sdk_init/route.js');
app.use(sdk_init.routes(), sdk_init.allowedMethods());






app.listen(1234, function() {
  console.log('on 1234');
});
