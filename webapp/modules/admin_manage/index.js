(function($, window) {
  function Admin() {
    var me = this;
    me.API = new conf.module.API();
  };
  Admin.prototype = {
    init: function() {
      var me = this;
      // 关注验证
      common_fn.follow_init(function() {
        me.admin_init();
      });
    },
    admin_init: function() {
      var me = this;
      me._login();
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
            if (data.ret==-1) {
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
    _login_done:function () {
      var me = this;
      $('#login').css({
        height:0
      });
      $('#login>*').hide();
    },
  };
  conf.module["Admin"] = Admin;
})(jQuery, window);
