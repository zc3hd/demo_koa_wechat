'use strict';
var getRawBody = require('raw-body');

// 获取票据
var Token = require('./token/token.js');
// 工具函数
var tool = require('./tool.js');


// 和微信有关的业务逻辑全部放在这里
module.exports = function(conf) {
  var opts = conf.wx;
  // 一启动服务的时候就会拿到token
  new Token(conf).init();
  
  return function*(next) {

    var sha = tool.sha({
      token:opts.token,
      timestamp:this.query.timestamp,
      nonce:this.query.nonce
    });
    // 加密串和回音
    var signature = this.query.signature;
    var echostr = this.query.echostr;
    console.log(this.path);
    // ----------------------------get--微信端和我端配对
    if (this.method == "GET") {
      if (sha == signature) {
        this.body = echostr + "";
        console.log('>>配置成功');
      } else {
        this.body = "";
        console.log('>>配置失败');
      }
    }
    // ---------------post--微信客服端--微信服务器-交互
    else if (this.method == "POST") {
      // 验证不通过
      if (sha != signature) {
        this.body = "";
        return;
      }
      // 解析的数据
      var data_xml = yield getRawBody(this.req, {
        length: this.length,
        limit: '1mb',
        encoding: this.charset
      });
      // 格式化对象
      var data_f = yield tool.xml2js(data_xml);

      // 用户过来的信息再次格式化
      var data = tool.format_data(data_f.xml);

      // 给用户回复的信息
      var echo = yield tool.data_to_echo(data);
      // console.log(echo);
      
      this.status = 200;
      this.type = 'application/xml';
      this.body = tool.tpl(echo);
      return;
    }
  }
}
