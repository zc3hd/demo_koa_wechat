var API = {
  // 收集微信用户
  wx_user: function(obj) {
    return $.ajax({
      url: "/api/baby/add_wx_user",
      dataType: "json",
      type: "POST",
      data: obj
    })
  },
  // 宝宝报名
  add_baby: function(obj) {
    return $.ajax({
      url: "/api/baby/add_baby",
      type: 'POST',
      data: obj,
      // 告诉jQuery不要去处理发送的数据
      processData: false,
      // 告诉jQuery不要去设置Content-Type请求头
      contentType: false,
      beforeSend: function() {},
    });
  },
};
