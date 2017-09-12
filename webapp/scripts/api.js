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
        });
      },
      // 素材列表
      material_list: "/api/admin/material/list",
      // 添加临时
      add_temp: function(obj) {
        return $.ajax({
          url: "/api/admin/material/add_temp",
          type: 'POST',
          data: obj,
          // 告诉jQuery不要去处理发送的数据
          processData: false,
          // 告诉jQuery不要去设置Content-Type请求头
          contentType: false,
          beforeSend: function() {},
        });
      },
      // 本地预设 文本或静态图文 或SDK
      add_text_news: function(obj) {
        return $.ajax({
          url: "/api/admin/material/add_text_news",
          dataType: "json",
          type: "POST",
          data: obj
        });
      },
      // 删除素材
      del_material:function(obj) {
        return $.ajax({
          url: "/api/admin/del_material",
          dataType: "json",
          type: "POST",
          data: obj
        });
      },
      // 更新news
      upd_news:function(obj) {
        return $.ajax({
          url: "/api/admin/upd_news",
          dataType: "json",
          type: "POST",
          data: obj
        });
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
    // ------------------------------pc
    admin_pc: {
      // 新增临时
      add_temp: "/api/material/add_temp",
    },
  };
  conf.module["API"] = API;
})(jQuery, window);