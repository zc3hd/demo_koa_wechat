
var SDK = require('./modules/sdk.js');
// ----------------------------------------------------sdk
// 输出验证
exports.sdk_init_signature = function*(next) {
  var me = this;
  var data = yield new SDK(me.request.body.url).init();
  me.body = data;
}

// ----------------------------------------------------admin
var Admin = require('./modules/admin.js');
// admin登录
exports.admin_login = function*(next) {
  var me = this;
  var data = yield new Admin(me.request.body).init();
  me.body = data;
}

