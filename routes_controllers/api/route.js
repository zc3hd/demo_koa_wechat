var router = require('koa-router')();
// var Router  = require('koa-router');
// var router = new Router();
var _controller = require('./contoller.js');
var conf = require('../../wechat/config.js');

// --------------------------------------------------sdk
// 验证输出
router.post('/api/sdk_init/signature', _controller.sdk_init_signature);

// --------------------------------------------------admin
// 登录
router.post('/api/admin/login', _controller.admin_login);

// --------------------------------------------------全部素材
router.post('/api/material/all', _controller.material_all);


// ---------------------------------------------新增-临时（voice,img,video）
var cc = function*(next) {
  yield next;
}
var body = require('koa-better-body');

router.post('/api/material/add_temp', body, _controller.material_add_temp);


module.exports = router;
