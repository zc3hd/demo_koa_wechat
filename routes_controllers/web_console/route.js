var router = require('koa-router')();
var _controller = require('./contoller.js');

// 微信前端页面的打印数据
router.post('/web_console', _controller.web_console);

module.exports = router;