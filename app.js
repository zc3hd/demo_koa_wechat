'use strict';
var Koa = require('koa');
var path = require('path');
var staticServer = require('koa-static');
var bodyparser = require('koa-bodyparser');
var colors = require('colors');
// 全局配置
var conf = require('./wechat/config.js');
colors.setTheme(conf.log);
// 数据库
var db = require('./mongo/db.js');



// -------------------------------------2017-8-29
var app = new Koa();

// PSOT解析
app.use(bodyparser({ enableTypes: ['json', 'form', 'text'] }));
// 静态文件
app.use(staticServer(path.join(__dirname, './webapp')));

// logger
// app.use(async(ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
// });


// ------------------------------------------wx
var wx = require('./routes/wx.js');
app.use(wx.routes(), wx.allowedMethods());

// ------------------------------------------api
// 前缀-- /api
var api_admin = require('./routes/api_admin.js');
app.use(api_admin.routes(), api_admin.allowedMethods());


// ------------------------------------------baby
// 前缀-- /api/baby
var api_baby = require('./routes/api_baby.js');
app.use(api_baby.routes(), api_baby.allowedMethods());




db.once('open', function(callback) {
  console.log(`>>--数据库-${conf.app.db}-连接成功--<<`.app);
  app.listen(conf.app.port, function() {
    console.log(`>>--app on-${conf.app.port}-启动成功--<<`.app);
  });
});






