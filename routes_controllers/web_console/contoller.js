exports.web_console = function*(next) {
  var me = this;
  console.log('---------------------------web-console----------------------');
  // 约定str就是传递字符串的
  console.log('str-->>'+me.request.body.str);
  // 约定obj就是传递对象的以字符串的形式
  console.log('data-->>');
  console.log(JSON.parse(me.request.body.data));
  console.log('------------------------------------------------------------');
  me.body = "test";
}