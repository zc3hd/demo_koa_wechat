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
      me.table_init();
    },
    // 关注验证
    follow_init: function(cb) {
      var me = this;
      var key = common_fn.getParam('from');
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
    table_init: function() {
      var me = this;
      console.log(1);
      $('#table').bootstrapTable({
        url: '/api/material/all', //请求后台的URL（*）
        method: 'post', //请求方式（*）
        // 查询字段
        queryParams: {
          //大小
          size: 10,
          //页码
          page: 1
        },
        toolbar: '#toolbar', //工具按钮用哪个容器
        striped: true, //是否显示行间隔色
        //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        cache: false,
        //是否显示分页（*）
        pagination: true,
        //是否启用排序
        sortable: false,
        //排序方式
        sortOrder: "asc",
        //分页方式：client客户端分页，server服务端分页（*）
        sidePagination: "server",
        //初始化加载第一页，默认第一页
        pageNumber: 1,
        //每页的记录行数（*）
        pageSize: 1,
        //可供选择的每页的行数（*）
        pageList: [10, 25, 50, 100],
        //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        search: false,
        strictSearch: true,
        //是否显示所有的列
        showColumns: true,
        //是否显示刷新按钮
        showRefresh: false,
        //最少允许的列数
        minimumCountColumns: 2,
        //是否启用点击选中行
        clickToSelect: true,
        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        height: 500,
        //每一行的唯一标识，一般为主键列
        uniqueId: "ID",
        //是否显示详细视图和列表视图的切换按钮
        showToggle: false,
        //是否显示详细视图
        cardView: false, 
        //是否显示父子表
        detailView: false, 
        // 列
        columns: [{
          checkbox: true
        }, {
          field: 'key',
          title: 'key'
        }, {
          field: 'category',
          title: 'category'
        }, {
          field: 'expires_in',
          title: 'expires_in'
        }]
      });
    },
  };
  conf.module["Admin"] = Admin;
})(jQuery, window);
