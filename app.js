'use strict';
var Koa = require('koa');
var path = require('path');
var staticServer = require('koa-static');
var bodyparser = require('koa-bodyparser')
var conf = require('./wechat/config.js');
var colors = require('colors');
colors.setTheme(conf.log);


// -------------------------------------2017-8-29
var app = new Koa();
// 数据库
var db = require('./mongo/db.js');
// PSOT解析
app.use(bodyparser({ enableTypes: ['json', 'form', 'text'] }));
// 静态文件
app.use(staticServer(path.join(__dirname, './webapp')));


// ------------------------------------------API
var all_routes = require('./routes_controllers/routes.js')
all_routes(app);



db.once('open', function(callback) {
  console.log(`>>--数据库-${conf.app.db}-连接成功--<<`.app);
  app.listen(conf.app.port, function() {
    console.log(`>>--app on-${conf.app.port}-启动成功--<<`.app);
  });
});

















// -------------------------------------2017-8-25
// // 微信服务器验证我们
// var wx = require('./wechat/wx.js');
// // 配置项
// var conf = require('./wechat/config.js');
// // router

// var app = new Koa();

// // 
// app.use(wx(conf));
