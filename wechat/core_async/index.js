// 用于全局数据挂载
var temp = require('../config.js').net.temporary;

var conf = require('../config.js')
var Token = require('../token/token.js');



function Core_async() {
  var me = this;
}
Core_async.prototype = {
  // 初始化--yield函数
  init: function*(ComeInfo, echo) {
    var me = this;
    me.ComeInfo = ComeInfo;
    me.echo = echo;

    // 默认回复数据
    me.echo_default = conf.wx.echo_default;

    // temp.expires_in = 1500000000000;
    // 临时素材过期
    if (!me._valid(temp.expires_in)) {
      // 重新加载数据
      var obj = yield new Token(conf).temp_reload();
      // console.log(obj);
    }
    return me._valid_done();
  },
  // 验证有效
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
  // 验证完成后发送数据
  _valid_done: function() {
    var me = this;
    // 拿到有效数据
    var index = temp.arr.indexOf(me.ComeInfo);
    // 有效数据中没有--回复默认
    if (index != -1) {
      me.echo_default = temp.data[index];
    }

    me._echo_make();
    return me.echo;
  },
  // 拿到具体数据进行数据挂载
  _echo_make: function() {
    var me = this;
    // 挂载数据
    for (var k in me.echo_default) {
      me.echo[k] = me.echo_default[k]
    }
    // 更新时间
    me.echo.CreateTime = new Date().getTime();
  },
};
// 该函数是被动回复的核心
module.exports = Core_async;
