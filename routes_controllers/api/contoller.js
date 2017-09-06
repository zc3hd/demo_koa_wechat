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

// ------------------------------------------------------material
// 全部素材
exports.material_all = function*(next) {
  var me = this;
  console.log(me.request.body)
  me.body = {
    total: 3,
    rows: [{
      key: 'aaa',
      category: 'loc',
      expires_in: 111111
    }, {
      key: 'bbb',
      category: 'loc',
      expires_in: 111111
    }, {
      key: 'ccc',
      category: 'loc',
      expires_in: 111111
    }]
  };
}
