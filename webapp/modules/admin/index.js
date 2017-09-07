(function($, window) {
  function Admin(id) {
    var me = this;
    me.API = new conf.module.API();

    // id
    me.id = id;
    // 列表容器
    me.list = $('#' + id);

    // 选择到的数据
    me.row = null;
  };
  Admin.prototype = {
    init: function() {
      var me = this;
      me.nav();
      me.add_material();
      // 列表事件
      // me.event();
      // me.login();
    },
    // ---------------------------------------------event
    event: function() {
      var me = this;
      me.add();
      me.upd();
      me.del();
    },
    add: function(argument) {
      var me = this;
      $('#main .add').off().on('click', function(argument) {
        // 素材
        if (me.key == 'material') {
          me.add_material();
        }
      });
    },
    // 添加素材
    add_material: function() {
      var me = this;

      var str = `
      <div id="material">
        <div>
          <div class="middle info">key</div>
          <div class="middle ipt">
            <input type="text" id="key" placeholder="key">
          </div>
        </div>

        <!-- 存储类别 -->
        <div>
          <div class="middle info">category</div>
          <div class="middle ipt">
            <select id="category">
              <option value='local'>本地</option>
              <option value='temp'>临时</option>
              <option value='sdk'>SDK</option>
            </select>
          </div>
        </div>
        <!-- 信息类型 -->
        <div class="MsgType">
          <div class="middle info">MsgType</div>
          <div class="middle ipt">
            <select id="MsgType">
              <option value='text'>text</option>
              <option value='news'>news</option>
            </select>
          </div>
        </div>

        <!-- 文本 -->
        <div class="text">
          <div class="middle info">Content</div>
          <div class="middle ipt">
            <input type="text" id="Content" placeholder="Content">
          </div>
        </div>
        
        <!-- 图文 -->
        <div class="news">
          <div class="middle info">Title</div>
          <div class="middle ipt">
            <input type="text" id="Title" placeholder="Title">
          </div>
        </div>
        <div class="news">
          <div class="middle info">Description</div>
          <div class="middle ipt">
            <input type="text" id="Description" placeholder="Description">
          </div>
        </div>
        <div class="news">
          <div class="middle info">PicUrl</div>
          <div class="middle ipt">
            <input type="text" id="PicUrl" placeholder="PicUrl">
          </div>
        </div>
        <div class="news"> 
          <div class="middle info">Url</div>
          <div class="middle ipt">
            <input type="text" id="Url" placeholder="Url">
          </div>
        </div>

        <!-- 音频 -->
        <div class="voice">
          <div class="middle info">voice</div>
          <div class="middle ipt">
            <form action="" method="post" enctype="multipart/form-data" id="form_voice">  
              <input type="file" id="voice"> 
            </form>
          </div>
        </div>
        
      </div>
      `;



      layer.open({
        type: 1,
        title: 'add material',
        area: ['300px', '500px'],
        anim: 1,
        shade: 0.6,
        closeBtn: 0,
        content: str,
        btn: ['add', 'cancel'],
        yes: function(index, layero) {

          $("#form_voice").ajaxSubmit({
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            scriptCharset: 'utf-8',
            // data: {},
            success: function(data) {
              console.log(data);
            },
            error: function() {}
          });
        },
        btn2: function(index, layero) {

        },
        success: function(layero, index) {
          console.log(me.API.admin_pc.add_temp);
          $('#form_voice').attr('action', me.API.admin_pc.add_temp);
          me.add_material_layer();
        },
      });
    },
    // 添加素材弹窗的一些事件
    add_material_layer: function(argument) {
      var me = this;
      // 类别选择
      $('#category').off().on('change', function() {
        var category = $('#category').val();
        // 本地--图文和文本
        if (category == 'local') {
          // 类型
          $('#material>.MsgType').show();
          $('#MsgType').html(`
            <option value='text'>text</option>
            <option value='news'>news</option>
            `);
          // 默认文本显示
          $('#material>.text').show(100);
          $('#material>.news').hide(100);
          // 
          $('#material>.voice').hide(100);
          $('#material>.video').hide(100);
          $('#material>.image').hide(100);
        }
        // -临时
        else if (category == 'temp') {
          // 类型
          $('#material>.MsgType').show();
          $('#MsgType').html(`
            <option value='voice'>voice</option>
            <option value='video'>video</option>
            <option value='image'>image</option>
            `);

          // 默认音乐显示
          $('#material>.voice').show(100);
          $('#material>.video').hide(100);
          $('#material>.image').hide(100);
          // 
          $('#material>.text').hide(100);
          $('#material>.news').hide(100);
        }
        // sdk
        else if (category == 'sdk') {
          $('#material>.MsgType').hide(100);
        }
      });
      // 信息类型
      $('#MsgType').off().on('change', function() {
        var MsgType = $('#MsgType').val();
        // 本地--图文和文本
        if (MsgType == 'text') {
          $('#material>.text').show(100);
          $('#material>.news').hide(100);
        }
        // 图文
        else if (MsgType == 'news') {
          $('#material>.text').hide(100);
          $('#material>.news').show(100);
        }
      });
    },
    // ---------------------------------------------nav
    nav: function() {
      var me = this;
      me.nav_load($('#nav>div>span.active').html());
      $('#nav>div>span').off().on('click', function(e) {
        if ($(e.currentTarget).hasClass('active')) {
          return
        }
        $('#nav>div>span').removeClass("active");
        $(e.currentTarget).addClass('active');
        var key = $(e.currentTarget).html();
        me.nav_load(key);
      });
    },
    // 页面加载
    nav_load: function(key) {
      var me = this;
      // 全局挂载
      me.key = key;
      //设备表头--请求地址
      me.list_url_title(key);
      me.list_init();
    },
    // ---------------------------------------------登录
    login: function() {
      var me = this;
      var str = `
      <div id="login">
        <div>
          <div class="middle info">name</div>
          <div class="middle ipt">
            <input type="text" id="name" placeholder="name">
          </div>
        </div>
        <div>
          <div class="middle info">password</div>
          <div class="middle ipt">
            <input type="password" id="password" placeholder="password">
          </div>
        </div>
      </div>
      `;
      layer.open({
        type: 1,
        title: 'login',
        area: ['300px', '200px'],
        anim: 1,
        shade: 0.6,
        closeBtn: 0,
        content: str,
        skin: 'admin',
        btn: ['login'],
        yes: function(index, layero) {
          me.login_yes(index)
        },
        success: function(layero, index) {},
      });
    },
    // 点击登录
    login_yes: function(index) {
      var me = this;
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
            me.login_done(index);
          }
        })
    },
    // 登录成功
    login_done: function(index) {
      var me = this;
      layer.close(index);
    },
    // ---------------------------------------------list
    // 表头参数设置
    list_url_title: function(key) {
      var me = this;
      // 素材管理
      if (key == 'material') {
        me.url = '/api/material/all';
        me.title = key;
        me.list_title = [
          [
            { field: 'id', checkbox: true, width: "10%" },
            { field: 'key', title: 'key', width: '10%' },
            // 类型
            {
              field: 'val',
              title: 'MsgType',
              width: '10%',
              formatter: function(value, row, index) {
                var val = JSON.parse(value);
                var str = ''
                if (val.MsgType == 'news') {
                  str = '图文';
                } else if (val.MsgType == 'text') {
                  str = '文本';
                } else if (val.MsgType == 'voice') {
                  str = '音频';
                } else if (val.MsgType == 'image') {
                  str = '图片';
                } else if (val.MsgType == 'video') {
                  str = '视频';
                }
                return str;
              }
            },
            // 分类
            { field: 'category', title: 'category', width: '20%' },
            // 过期时间
            {
              field: 'expires_in',
              title: 'expires_in',
              width: '50%',
              formatter: function(value, row, index) {
                var now = (new Date().getTime());
                if (value < now && value > 0) {
                  return '已过期';
                } else if (value == 0) {
                  return;
                } else {
                  return common_fn.formatterDateDay(value);
                }
              }
            },
          ]
        ];
      }
    },
    // 表格初始化
    list_init: function() {
      var me = this;
      var height = $('#main').height() - 54;
      me.list.datagrid({
        url: me.url,
        method: 'post',
        title: me.title,
        columns: me.list_title,
        // isField: "id",
        height: height,
        width: '100%',
        rownumbers: true,
        singleSelect: true,
        queryParams: {},
        loadMsg: "查询数据中...",
        // 显示分页
        pagination: true,
        // 分页大小
        pageSize: 20,
        // 分页选择
        pageList: [10, 20, 30, 40, 50],
        // 自动补全
        fit: false,
        fitColumns: true,
        // resizeable: true,
        // 图标
        iconCls: "icon-save",
        onLoadSuccess: function(data) {
          //设置中文显示
          common_fn.set_lang_zn(me.id);
          $('.searchnodata').remove();
          if (data.total == 0) {
            $('.datagrid-view')
              .append('<div id = "hasNoneData" style="text-align:center;padding-top:40px;" class="searchnodata">没有找到相关记录</div>');
          }
        },
      });
    },

  };
  conf.module["Admin"] = Admin;
})(jQuery, window);
