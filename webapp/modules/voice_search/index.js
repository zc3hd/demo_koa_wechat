(function($, window) {
  function Main() {
    var me = this;
    me.api = new conf.module.API();
  };
  Main.prototype = {
    init: function() {
      var me = this;
      me.sdk_init();
    },
    // sdk初始化
    sdk_init: function() {
      var me = this;
      me.api.signature()
        .done(function(data) {
          console.log(data);
          me.record();
        });

    },
    // 初始化配置
    wx_config: function(data) {
      var me = this;
      wx.config({
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        debug: true,
        // 必填，公众号的唯一标识
        appId: data.appId,
        // 必填，生成签名的时间戳
        timestamp: data.timestamp,
        // 必填，生成签名的随机串
        nonceStr: data.noncestr,
        // 必填，签名，见附录1
        signature: data.signature,
        // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        jsApiList: [
          'startRecord',
          'stopRecord',
          'onVoiceRecordEnd',
          'translateVoice'
        ]
      });
    },
    // 语音交互
    record: function() {
      var me = this;
      var str = '语音搜索电影'
      $('#btn').html(str)
      $('#btn').on('touchstart', function() {
        $('#btn')
          .css({
            height: '20%',
            backgroundImage: 'url("./img/start.GIF")',
            fontSize: "2rem"
          })
          .addClass('bottom')
          .html('正在录音...');
      });
      $('#btn').on('touchend', function() {
        $('#btn')
          .css({
            height: '10%',
            backgroundImage: 'url("./img/end.jpg")',
            fontSize: "2.5rem"
          })
          .removeClass("bottom")
          .html(str);
      });
    },
  };
  conf.module["Main"] = Main; // 登录
})(jQuery, window);
