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
// pc素材 material list
router.post('/admin/material/list', async function(ctx, next) {
  var data = await new tool.Material().list(ctx.request.body);
  ctx.body = data;
});










// pc 添加临时素材
router.post('/admin/material/add_temp', async function(ctx, next) {

  var data = await new tool.Material()._temp_add_local(ctx.req);
  var obj = await new tool.Material()._temp_key(data);
  // const serverPath = path.join(__dirname, '../cc');

  // console.log(ctx.req.body);
  // var data = await uploadFile(ctx, {
  //   fileType: 'album',
  //   path: serverPath
  // });

  ctx.body = obj || { a: 1 };
});










module.exports = router
