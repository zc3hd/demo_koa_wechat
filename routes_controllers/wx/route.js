var router = require('koa-router')();
var _controller = require('./contoller.js');

// 微信验证
router.get('/', _controller.approve_init);
// 微信回复
router.post('/', _controller.approve_echo);


module.exports = router;