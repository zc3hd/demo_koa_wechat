// ----------------------------------------------------sdk
var SDK = require('./modules/sdk.js');
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

// ------------------------------------------------------material-素材列表
var Material = require('./modules/material.js');
// 全部素材
exports.material_all = function*(next) {
  var me = this;
  var data = yield new Material().all(me.request.body);
  // 
  me.body = data;
}

// ------------------------------------------------------material-新增临时
var Material = require('./modules/material.js');
// 新增临时
exports.material_add_temp = function*(next) {
  var me = this;
  // var data = yield new Material().all(me.request.body);
  console.log(this.request.body.files);
  console.log(this.request.fields)
  // 
  me.body = {
    "MsgType": "text",
    "Content": "你输入的是2"
  };
}
