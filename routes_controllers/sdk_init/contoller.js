// 票据对象
var conf = require('../../wechat/config.js');
var sha1 = require('sha1');
var Token = require('../../wechat/token/token.js');

function Fn(url) {
  var me = this;
  me.url = url;
}
Fn.prototype = {
  init: function*() {
    var me = this;

    // conf.ticket.expires_in = 1500000000000;
    
    // ------------有效
    if (me._valid(conf.ticket.expires_in)) {}
    // 无效
    else {
      yield new Token(conf).api_ticket_reload();
    }
    return me._valid_yes();
  },
  // 验证有效性
  _valid: function(expires_in) {
    var me = this;
    var now = (new Date().getTime());
    // 有效
    if (now < expires_in * 1) {
      console.log('* api_ticket--本地有效');
      return true;
    }
    // 无效
    else {
      console.log('* api_ticket--本地无效');
      return false;
    }
  },
  // 有效
  _valid_yes: function() {
    var me = this;
    var noncestr = Math.random().toString(36).substr(2, 15);
    var timestamp = parseInt(new Date().getTime() / 1000, 10) + '';
    var signature = me._signature(noncestr, timestamp);
    return {
      noncestr: noncestr,
      timestamp: timestamp,
      signature: signature,
      appId: conf.wx.appID
    }
  },
  // 签名生成
  _signature: function(noncestr, timestamp) {
    var me = this;
    var jsapi_ticket = conf.ticket.api_ticket;
    var arr = [
      'jsapi_ticket=' + jsapi_ticket,
      'noncestr=' + noncestr,
      'timestamp=' + timestamp,
      'url=' + me.url
    ];
    var str = arr.sort().join('&');
    return sha1(str);
  },

};


// 输出验证
exports.signature = function*(next) {
  var me = this;
  var data = yield new Fn(me.request.body.url).init();
  me.body = data;
}
