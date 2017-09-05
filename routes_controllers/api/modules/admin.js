var User = require('../../../mongo/models/User.js');
// 数据初始化
var Data = require('../../../mongo/models/Data.js');

function Admin(opts) {
  var me = this;
  me.opts = opts;
}
Admin.prototype = {
  init: function*() {
    var me = this;

    var user = yield User
      .findOne({ name: me.opts.name })
      .exec();

    var echo = me.user_handle(user);

    return echo;
  },
  user_handle:function (data) {
    var me = this;
    // 没有查到数据
    if (data==null) {
      return {
        ret:-1,
        info:'看来~你还不知道用户名~~'
      };
    }
    // 密码错误
    else if (data.password!=me.opts.password) {
      return {
        ret:-1,
        info:'看来~你还不知道密码~~'
      };
    }
    // 不是我登录
    else if (data.user_id!=me.opts.FromUserName) {
      return {
        ret:-1,
        info:'哇~你知道了管理员的账户和密码，本系统知道你不是管理员~~所以禁止登录~~'
      };
    }
    // 不是我登录
    else  {
      return {
        ret:0,
        info:'welcome admin~~'
      };
    }
  },

};

module.exports = Admin;
