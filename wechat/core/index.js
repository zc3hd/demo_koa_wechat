// 用于全局数据挂载
var Common = require('../config.js');

function Core() {
  var me = this;
}
Core.prototype = {
  // 初始化
  init: function(index, echo, key) {
    var me = this;

    switch (key) {
      // 本地预设
      case "local":
        me.core = Common.wx.echo;
        break;
        // other
      case "other":
        me.core = Common.net.permanent.data_other;
        break;
        // other
      case "news":
        me.core = Common.net.permanent.data_other;
        break;
    }

    me.index = index;
    me.echo = echo;
    // 拿到具体数据进行数据挂载
    me._echo_make();
  },

  // 拿到具体数据进行数据挂载
  _echo_make: function() {
    var me = this;
    // 挂载数据
    for (var k in me.core[me.index]) {
      me.echo[k] = me.core[me.index][k]
    }
    // 更新时间
    me.echo.CreateTime = new Date().getTime();
  },
};
// 该函数是被动回复的核心
module.exports = Core;
