// 票据对象
var conf = require('../../wechat/config.js');
var sha1 = require('sha1');

function Fn() {
  var me = this;
}
Fn.prototype = {
  init: function() {
    var me = this;
    // 有效
    if (me._valid(conf.ticket.expires_in)) {
      var noncestr = Math.random().toString(36).substr(2, 15);
      var timestamp = parseInt(new Date().getTime() / 1000, 10) + '';
      var signature = me._signature(noncestr, timestamp);
      return {
        noncestr: noncestr,
        timestamp: timestamp,
        signature: signature,
        appID:conf.wx.appID
      }
    }
    // 无效
    else {

    }
  },
  // 验证有效性
  _valid: function(expires_in) {
    var me = this;
    var now = (new Date().getTime());
    // 有效
    if (now < expires_in * 1) {
      return true;
    }
    // 无效
    else {
      return false;
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
      'url=' + conf.wx.url_sdk
    ];
    console.log({
      jsapi_ticket:jsapi_ticket,
      noncestr:noncestr,
      timestamp:timestamp,
      url:conf.wx.url_sdk
    });
    var str = arr.sort().join('&');
    return sha1(str);
  }
};
// 输出验证
exports.signature = function*(next) {
  var me = this;
  var data = new Fn().init();
  me.body = data;
}
