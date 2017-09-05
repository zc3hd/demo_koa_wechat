exports.web_console = function*(next) {
  var me = this;
  console.log('---------------------------web-console----------------------');
  // 约定str就是传递字符串的
  console.log('info-->>' + me.request.body.info);
  // console.log('data-->>'+JSON.parse(me.request.body.data));
  console.log('------------------------------------------------------------');
  me.body = "test";
}
