module.exports = function(app) {
  // --------------------------------------前端数据的后台打印显示
  var web_console_test = require('./web_console/route.js');
  app.use(web_console_test.routes(), web_console_test.allowedMethods());

  // --------------------------------------和微信服务器的交互
  var wx = require('./wx/route.js');
  app.use(wx.routes(), wx.allowedMethods());

  // --------------------------------------API
  var API = require('./api/route.js');
  app.use(API.routes(), API.allowedMethods());

};
