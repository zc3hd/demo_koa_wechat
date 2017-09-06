var sha1 = require('sha1');

var conf = require('../../../wechat/config.js');
var Token = require('../../../wechat/token.js');

function SDK(url) {
  var me = this;
  me.url = url;
}
SDK.prototype = {
  init: function*() {
    var me = this;
    // 全局刷票据
    yield new Token().ticket_reload();
    // 返回数据
    return me.back_data();
  },
  // 回复的数据
  back_data: function() {
    var me = this;
    var jsapi_ticket = conf.sdk.api_ticket;
    var noncestr = Math.random().toString(36).substr(2, 15);
    var timestamp = parseInt(new Date().getTime() / 1000, 10) + '';
    var arr = [
      'jsapi_ticket=' + jsapi_ticket,
      'noncestr=' + noncestr,
      'timestamp=' + timestamp,
      'url=' + me.url
    ];
    var str = arr.sort().join('&');
    var signature = sha1(str);
    return {
      noncestr: noncestr,
      timestamp: timestamp,
      signature: signature,
      appId: conf.wx.appID
    }
  },
};

module.exports = SDK;
