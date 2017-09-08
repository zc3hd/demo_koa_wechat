(function($, window) {
  function API() {
    var me = this;
  };
  API.prototype = {
    // ------------------------------SDK
    sdk: {
      // 签名验证
      signature: function(obj) {
        return $.ajax({
          url: "/api/sdk/signature",
          dataType: "json",
          type: "POST",
          data: obj
        })
      },
    },
    // ------------------------------超级管理员
    admin: {
      // 登录
      pc_login: function(obj) {
        return $.ajax({
          url: "/api/admin/pc_login",
          dataType: "json",
          type: "POST",
          data: obj
        })
      },
      // 素材列表
      material_list:"/api/admin/material/list",
      // 添加临时
      add_temp:"/api/admin/material/add_temp",
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
    // ------------------------------pc
    admin_pc: {
      // 新增临时
      add_temp: "/api/material/add_temp",
    },
  };
  conf.module["API"] = API;
})(jQuery, window);
