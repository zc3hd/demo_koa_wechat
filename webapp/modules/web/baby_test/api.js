var API = {
  // 访问量
  views:function(obj) {
    return $.ajax({
      url: "/api/baby/views",
      dataType: "json",
      type: "POST",
      // data: obj
    })
  },
  // 统计数据
  hot: function(obj) {
    return $.ajax({
      url: "/api/baby/hot_count",
      dataType: "json",
      type: "POST",
      // data: obj
    })
  },
  // 截止时间获取
  time_end: function(obj) {
    return $.ajax({
      url: "/api/baby/time_end",
      dataType: "json",
      type: "POST",
      // data: obj
    })
  },
  // -------------------------------------------------------
  // 收集微信用户
  wx_user: function(obj) {
    return $.ajax({
      url: "/api/baby/add_wx_user",
      dataType: "json",
      type: "POST",
      data: obj
    })
  },
  // 获取支线任务的用户信息
  wx_winner: function(obj) {
    return $.ajax({
      url: "/api/baby/wx_winner",
      dataType: "json",
      type: "POST",
      data: obj
    })
  },
  // 广播获奖者
  wx_winner_tips:function(obj) {
    return $.ajax({
      url: "/api/baby/wx_winner_tips",
      dataType: "json",
      type: "POST",
      // data: obj
    })
  },
  // -------------------------------------------------------
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
  // list
  list: function(obj) {
    return $.ajax({
      url: "/api/baby/list",
      dataType: "json",
      type: "POST",
      data: obj
    })
  },
  // level_list
  level_list: function(obj) {
    return $.ajax({
      url: "/api/baby/level_list",
      dataType: "json",
      type: "POST",
      // data: obj
    })
  },
  // 投票
  vote: function(obj) {
    return $.ajax({
      url: "/api/baby/vote",
      dataType: "json",
      type: "POST",
      data: obj
    })
  },
  // 搜索
  search:function(obj) {
    return $.ajax({
      url: "/api/baby/search",
      dataType: "json",
      type: "POST",
      data: obj
    })
  },
  // ---------------------------------------------------------
  // info 活动信息
  info:function(obj) {
    return $.ajax({
      url: "/api/baby/info",
      dataType: "json",
      type: "POST",
      data: obj
    })
  },
};
