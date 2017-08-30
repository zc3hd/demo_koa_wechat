var router = require('koa-router')();
var _controller = require('./contoller.js');


// 验证输出
router.post('/sdk_init/signature', _controller.signature);


module.exports = router;