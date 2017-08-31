
exports.web_console = function*(next) {
  var me = this;
  console.log('---------------------------web-console----------------------');
  console.log(me.request.body);
  console.log('------------------------------------------------------------');
  me.body = "test";
}
