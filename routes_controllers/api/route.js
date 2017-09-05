var router = require('koa-router')();
var _controller = require('./contoller.js');


// --------------------------------------------------sdk
// 验证输出
router.post('/api/sdk_init/signature', _controller.sdk_init_signature);


// --------------------------------------------------admin
// 登录
router.post('/api/admin/login', _controller.admin_login);


module.exports = router;