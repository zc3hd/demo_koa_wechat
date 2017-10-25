const router = require('koa-router')();
var getRawBody = require('raw-body');

var tool = require('../wechat/tool.js');
var conf = require('../wechat/config.js');
var Token = require('../wechat/token.js');
// 一启动服务的时候就会拿到token
new Token().init();

// ----------初次验证验证配置
router.get('/', async(ctx, next) => {
  // 路径解析
  var obj = tool.parseUrl(ctx.url);


  var sha = tool.sha({
    token: conf.wx.token,
    timestamp: obj.timestamp,
    nonce: obj.nonce
  });
  // 加密串和回音
  var signature = obj.signature;

  // 验证不成功
  if (sha != signature) {
    ctx.body = "";
    console.log('>>--配置失败');
  }
  // 验证成功
  else {
    ctx.body = obj.echostr + "";
    console.log('>>--配置成功');

  }
  next();
});

// -----------微信服务器的回复
router.post('/', async function(ctx, next) {
  // 路径解析
  var obj = tool.parseUrl(ctx.url);

  var sha = tool.sha({
    token: conf.wx.token,
    timestamp: obj.timestamp,
    nonce: obj.nonce
  });
  // 加密串和回音
  var signature = obj.signature;

  // 验证不成功
  if (sha != signature) {
    ctx.body = "";
  }
  // 验证成功
  else {
    // 这个傻逼。我操。
    var data_xml = await getRawBody(ctx.req, {
      length: ctx.request.header['content-length'],
      limit: '1mb',
      encoding: "utf-8"
    });
    // 格式化对象
    var data_f = await tool.xml2js(data_xml);

    // 用户过来的信息再次格式化
    var data = tool.format_data(data_f.xml);


    // 给用户回复的信息
    var echo = await tool.data_to_echo(ctx.url, data);


    ctx.res.status = 200;
    ctx.res.type = 'application/xml';
    ctx.body = tool.tpl(echo);
    // next();
  }
});

module.exports = router;
