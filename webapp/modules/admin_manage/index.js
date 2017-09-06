(function($, window) {
  function Admin() {
    var me = this;
    me.API = new conf.module.API();
  };
  Admin.prototype = {
    init: function() {
      var me = this;
      // 关注验证
      me.follow_init(function() {
        me._login();
      });
    },
    // 关注验证
    follow_init: function(cb) {
      var me = this;
      var key = common_fn.getParam('from');
      cons({
        info:key
      });
      // 已关注
      if (key == null) {
        // 执行相应的函数
        cb();
      }
      // 转发的，默认为未关注
      else {
        var str = `
          <div id="scan_m">
          <img src="/css/follow/wx.jpg" alt="">
          </div>
          `;
        layer.open({
          type: 1,
          title: '请长按二维进行关注后使用服务',
          area: ['90%', '60%'],
          anim: 1,
          shade: 0.6,
          closeBtn: 0,
          content: str,
          skin: 'layer_wxscan',
          success: function(layero, index) {

            var w = $('#scan_m').width();
            var h = $('#scan_m').height();

            // 高
            if (w > h) {
              $('#scan_m>img').css({
                width: h * 0.9 + 'px',
                height: h * 0.9 + 'px',
              });
            }
            // 宽
            else {
              $('#scan_m>img').css({
                width: w * 0.9 + 'px',
                height: w * 0.9 + 'px',
              });
            }

          }
        });
      }
    },
    // 登录
    _login: function() {
      var me = this;
      $('#login_btn').off().on('click', function() {
        var name = $('#name').val();
        var ps = $('#password').val();
        var FromUserName = common_fn.getParam('FromUserName');

        if (!name) {
          layer.msg('请输入用户名');
          return;
        }
        if (!ps) {
          layer.msg('请输入密码');
          return;
        }

        me.API.admin.login({
            name: name,
            password: $.md5(ps),
            FromUserName: FromUserName
          })
          .done(function(data) {
            // 错误
            if (data.ret == -1) {
              layer.msg(data.info);
            }
            // 成功
            else {
              layer.msg(data.info);
              me._login_done();
            }
          })
      });
    },
    // 登录成功
    _login_done: function() {
      var me = this;
      $('#login').css({
        height: 0
      });
      $('#login>*').hide();
    },
  };
  conf.module["Admin"] = Admin;
})(jQuery, window);
