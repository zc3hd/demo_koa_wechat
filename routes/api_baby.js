/*
* 此项API是萌宝大赛的所有的api
 */
const fs = require('fs')
const path = require('path');
const Busboy = require('busboy');
// 控制器
const Baby = require('../contollers/controller_baby.js');
// 路由
const router = require('koa-router')();


// 项目前缀
router.prefix('/api/baby');

// ----------------------------------------------统计数据显示
router.post('/hot_count', async function(ctx, next) {
  // console.log(ctx.request.body);
  var data = await new Baby()._all();
  ctx.body = data;
});

// ----------------------------------------------访问统计
router.post('/views', async function(ctx, next) {
  // 访客数据
  await new Baby()._count("views");
  ctx.body = {
    ret: 1
  };
});




// ----------------------------------------------新增微信用户
router.post('/add_wx_user', async function(ctx, next) {
  // console.log(ctx.request.body);
  var data = await new Baby().add_wx_one(ctx.request.body);
  ctx.body = data;
});

// -----------------------------------------------支线信息提交
router.post('/wx_winner', async function(ctx, next) {
  var data = await new Baby().wx_winner(ctx.request.body);
  ctx.body = data;
});


// -----------------------------------------------广播获奖者
router.post('/wx_winner_tips', async function(ctx, next) {
  var data = await new Baby().wx_winner_tips();
  ctx.body = data;
});



// -----------------------------------------------返回到期的时间
router.post('/time_end', async function(ctx, next) {
  // 获取到期时间
  var time_end = await new Baby()._time_end();

  // 返回到期的时间
  ctx.body = {
    expires_in:time_end.expires_in,
  };
});


// -----------------------------------------------添加宝宝
router.post('/add_baby', async function(ctx, next) {
  // 获取到期时间
  var time_end = await new Baby()._time_end();

  // 获取现在的时间
  var time_now = new Date().getTime();

  // 超过报名时间
  if (time_now>time_end.expires_in) {
    ctx.body = {
      ret:-1
    };
    return;
  }

  // 报名数据
  await new Baby()._count("num");
  // 上传到本地文件夹
  var data = await new Baby()._upload_to_server(ctx.req);
  // 本地数据库新增
  var echo = await new Baby()._save(data);
  // 回复报名的数据
  ctx.body = echo;
});


// -----------------------------------------------宝宝列表
router.post('/list', async function(ctx, next) {
  var data = await new Baby()._list(ctx.request.body);
  ctx.body = data;
});

// -----------------------------------------------宝宝排名
router.post('/level_list', async function(ctx, next) {
  var data = await new Baby()._level_list();
  ctx.body = data;
});


// -----------------------------------------------添加投票
router.post('/vote', async function(ctx, next) {
  var data = await new Baby()._vote(ctx.request.body);
  ctx.body = data;
});


// -----------------------------------------------搜索
router.post('/search', async function(ctx, next) {
  var data = await new Baby()._search(ctx.request.body);
  ctx.body = data;
});




// -----------------------------------------------活动信息
router.post('/info', async function(ctx, next) {
  var data = await new Baby()._info();
  ctx.body = data;
});












module.exports = router
