(function($, window) {
  function API() {
    var me = this;
  };
  API.prototype = {
    // ------------------------------sdk
    sdk: {
      // 签名验证
      signature: function(obj) {
        return $.ajax({
          url: "/api/sdk_init/signature",
          dataType: "json",
          type: "POST",
          data: obj
        })
      },
    },
    // ------------------------------超级管理员
    admin: {
      // 登录
      login: function(obj) {
        return $.ajax({
          url: "/api/admin/login",
          dataType: "json",
          type: "POST",
          data: obj
        })
      },
    },
    // ------------------------------电影
    movie: {
      // 寻找条目
      search: function(str) {
        return $.ajax({
          url: "https://api.douban.com/v2/movie/search?q=" + str,
          dataType: "jsonp",
          jsonp: 'callback',
          type: "GET",
        });
      },
    },

  };
  conf.module["API"] = API;
})(jQuery, window);
