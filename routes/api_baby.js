const fs = require('fs')
const path = require('path');
const Busboy = require('busboy');
const Baby = require('../contollers/controller_baby.js');
const router = require('koa-router')();



router.prefix('/api/baby');


// 统计数据
router.post('/hot_count', async function(ctx, next) {
  // console.log(ctx.request.body);
  var data = await new Baby()._all();
  ctx.body = data;
});



// 新增微信用户
router.post('/add_wx_user', async function(ctx, next) {
  // 访客数据
  await new Baby()._count("views");
  // console.log(ctx.request.body);
  var data = await new Baby().add_wx_one(ctx.request.body);
  ctx.body = data;
});


// 添加宝宝
router.post('/add_baby', async function(ctx, next) {
  // 报名数据
  await new Baby()._count("num");
  // 上传到本地文件夹
  var data = await new Baby()._upload_to_server(ctx.req);
  // 本地数据库新增
  var echo = await new Baby()._save(data);
  ctx.body =  echo;
});


// // 验证
// router.post('/sdk/signature', async function(ctx, next) {
//   var data = await tool.signature(ctx.request.body.url);
//   ctx.body = data;
// });


// // PC端登
// router.post('/admin/pc_login', async function(ctx, next) {
//   // console.log(ctx.request.body);
//   
//   ctx.body = data;
// });
// // pc素材list
// router.post('/admin/material/list', async function(ctx, next) {
//   var data = await new tool.Material().list(ctx.request.body);
//   ctx.body = data;
// });

// // pc 添加文本 和 news
// router.post('/admin/material/add_text_news', async function(ctx, next) {
//   // 添加 本地预设 或者 sdk
//   new tool.Material()._local_sdk_save(ctx.request.body);
//   ctx.body = { ret: 1 };
// });
// // pc 删除 素材
// router.post('/admin/del_material', async function(ctx, next) {
//   await new tool.Material()._del(ctx.request.body);
//   ctx.body = { ret: 1 };
// });

// // pc news 更新
// router.post('/admin/upd_news', async function(ctx, next) {
//   // console.log(ctx.request.body);
//   await new tool.Material()._upd_news(ctx.request.body);
//   ctx.body = { ret: 1 };
// });











module.exports = router
