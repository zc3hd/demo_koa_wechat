const fs = require('fs')
const path = require('path');
const Busboy = require('busboy');
const tool = require('../wechat/tool.js');
const router = require('koa-router')();



router.prefix('/api');

// ------------------------------------------------------前端的测试
router.post('/console', async function(ctx, next) {
  console.log('---------------------------web-console----------------------');
  console.log(ctx.request.body);
  console.log('------------------------------------------------------------');
  ctx.body = { a: 1 };
});

// --------------------------------------------------------SDK
// 验证
router.post('/sdk/signature', async function(ctx, next) {
  var data = await tool.signature(ctx.request.body.url);
  ctx.body = data;
});


// --------------------------------------------------------Admin
// PC端登
router.post('/admin/pc_login', async function(ctx, next) {
  // console.log(ctx.request.body);
  var data = await new tool.Admin().pc_login(ctx.request.body);
  ctx.body = data;
});
// pc素材list
router.post('/admin/material/list', async function(ctx, next) {
  var data = await new tool.Material().list(ctx.request.body);
  ctx.body = data;
});
// 添加临时素材
router.post('/admin/material/add_temp', async function(ctx, next) {
  // 上传到临时文件夹
  var data = await new tool.Material()._temp_add_local(ctx.req);
  // 转移到key的文件夹
  await new tool.Material()._temp_key(data);
  // 线上和本地数据库新增
  await new tool.Material()._temp_online_save(data);
  ctx.body =  { ret: 1 };
});
// pc 添加文本 和 news
router.post('/admin/material/add_text_news', async function(ctx, next) {
  // 添加 本地预设 或者 sdk
  new tool.Material()._local_sdk_save(ctx.request.body);
  ctx.body = { ret: 1 };
});
// pc 删除 素材
router.post('/admin/del_material', async function(ctx, next) {
  await new tool.Material()._del(ctx.request.body);
  ctx.body = { ret: 1 };
});

// pc news 更新
router.post('/admin/upd_news', async function(ctx, next) {
  // console.log(ctx.request.body);
  await new tool.Material()._upd_news(ctx.request.body);
  ctx.body = { ret: 1 };
});











module.exports = router
