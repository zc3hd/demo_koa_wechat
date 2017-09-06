var tool = require('../../wechat/tool.js');
var conf = require('../../wechat/config.js');
var Token = require('../../wechat/token.js');
// 一启动服务的时候就会拿到token
new Token().init();

// ------------------------------------微信服务器的回复
var getRawBody = require('raw-body');
exports.approve_echo = function*(next) {
  var me = this;
  var sha = tool.sha({
    token: conf.wx.token,
    timestamp: me.query.timestamp,
    nonce: me.query.nonce
  });
  // 加密串和回音
  var signature = me.query.signature;
  // 验证不成功
  if (sha != signature) {
    me.body = "";
    return;
  }
  // 验证成功
  else {
    // 解析的数据
    var data_xml = yield getRawBody(me.req, {
      length: me.length,
      limit: '1mb',
      encoding: me.charset
    });
    // 格式化对象
    var data_f = yield tool.xml2js(data_xml);

    // 用户过来的信息再次格式化
    var data = tool.format_data(data_f.xml);

    // 给用户回复的信息
    var echo = yield tool.data_to_echo(me.href, data);

    me.status = 200;
    me.type = 'application/xml';
    me.body = tool.tpl(echo);
    return;
  }
}


// ---------------------------------来自微信服务器初次验证验证配置
exports.approve_init = function*(next) {
  var me = this;
  var sha = tool.sha({
    token: conf.wx.token,
    timestamp: me.query.timestamp,
    nonce: me.query.nonce
  });
  // 加密串和回音
  var signature = me.query.signature;
  // 验证不成功
  if (sha != signature) {
    me.body = "";
    console.log('>>--配置失败');
    return;
  }
  // 验证成功
  else {
    me.body = me.query.echostr + "";
    console.log('>>--配置成功');
  }
}
