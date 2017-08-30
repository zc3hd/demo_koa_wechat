(function($, window) {
  function API() {
    var me = this;
  };
  API.prototype = {
    // 验证
    signature: function(obj) {
      return $.ajax({
        url: "/sdk_init/signature",
        dataType: "json",
        type: "POST",
        data: obj
      })
    },
  };
  conf.module["API"] = API; 
})(jQuery, window);
