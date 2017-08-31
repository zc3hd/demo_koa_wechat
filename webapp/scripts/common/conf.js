/**
 * Created by cc on 2017/8/29
 */
(function(win, $) {
  var conf = win.conf = win.conf || {
    // 挂载模块
    module: {},
  };
  win.cons = function(obj) {
    $.ajax({
      url: "/web_console",
      dataType: "json",
      type: "POST",
      data: obj
    });
  };
})(window, jQuery);
