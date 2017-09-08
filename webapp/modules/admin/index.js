(function($, window) {
  function Admin(id) {
    var me = this;
    me.API = new conf.module.API().admin;

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
      // me.upd();
      // me.del();
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

        <!-- 存储大类 -->
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

        <!-- 具体选择 -->
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
            <div class="lable_file_ipt">点击选择文件</div>
            <input type="file" id="voice_file" class="inp_file">
          </div>
        </div>

        <!-- 视频 -->
        <div class="video">
          <div class="middle info">Title</div>
          <div class="middle ipt">
            <input type="text" id="video_Title" placeholder="video_Title">
          </div>
        </div>
        <div class="video">
          <div class="middle info">Description</div>
          <div class="middle ipt">
            <input type="text" id="video_Description" placeholder="video_Description">
          </div>
        </div>
        <div class="video">
          <div class="middle info">video</div>
          <div class="middle ipt">
            <div class="lable_file_ipt">点击选择文件</div>
            <input type="file" id="video_file" class="inp_file">
          </div>
        </div>


        <!-- 图片 -->
        <div class="image">
          <div class="middle info">image</div>
          <div class="middle ipt">
            <div class="lable_file_ipt">点击选择文件</div>
            <input type="file" id="image_file" class="inp_file">
          </div>
        </div>
      </div>
      `;

      layer.open({
        type: 1,
        title: 'add material',
        area: ['300px', '350px'],
        anim: 1,
        shade: 0.6,
        // closeBtn: 0,
        content: str,
        btn: ['add'],
        success: function(layero, index) {
          // 添加素材弹窗的一些事件
          me.add_load_event();
        },
        yes: function(index, layero) {
          var load = layer.load();
          me.add_yes(index,load);
        },
        btn2: function(index, layero) {},

      });
    },
    // 添加素材弹窗的一些事件
    add_load_event: function(argument) {
      var me = this;
      // 大的类别的选择
      $('#category').off().on('change', function() {
        var category = $('#category').val();
        // 本地--图文和文本
        if (category == 'local') {

          // 类型区
          $('#material>.MsgType').show();

          // 具体类型选项
          $('#MsgType').html(`
              <option value='text'>text</option>
              <option value='news'>news</option>
            `);
          // 输入区
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

          // 具体类型选项
          $('#MsgType').html(`
              <option value='voice'>voice</option>
              <option value='video'>video</option>
              <option value='image'>image</option>
            `);

          // 输入区
          $('#material>.voice').show(100);
          $('#material>.video').hide(100);
          $('#material>.image').hide(100);
          // 
          $('#material>.text').hide(100);
          $('#material>.news').hide(100);
        }
        // sdk
        else if (category == 'sdk') {
          // 类型--没有了
          $('#material>.MsgType').hide(100);

          // 输入区--默认图文
          $('#material>.voice').hide(100);
          $('#material>.video').hide(100);
          $('#material>.image').hide(100);
          // 
          $('#material>.text').hide(100);
          $('#material>.news').show(100);
        }
      });

      // 默认是选了voice
      me._MsgType = "voice";
      // 具体选择类型
      $('#MsgType').off().on('change', function() {
        var MsgType = $('#MsgType').val();

        me._MsgType = MsgType;
        // 文本
        if (MsgType == 'text') {
          $('#material>.text').show(100);
          $('#material>.news').hide(100);
          $('#material>.voice').hide(100);
          $('#material>.video').hide(100);
          $('#material>.image').hide(100);
        }
        // 图文
        else if (MsgType == 'news') {
          $('#material>.text').hide(100);
          $('#material>.news').show(100);
          $('#material>.voice').hide(100);
          $('#material>.video').hide(100);
          $('#material>.image').hide(100);
        }
        // 音频
        else if (MsgType == 'voice') {
          $('#material>.text').hide(100);
          $('#material>.news').hide(100);
          $('#material>.voice').show(100);
          $('#material>.video').hide(100);
          $('#material>.image').hide(100);
        }
        // 视频
        else if (MsgType == 'video') {
          $('#material>.text').hide(100);
          $('#material>.news').hide(100);
          $('#material>.voice').hide(100);
          $('#material>.video').show(100);
          $('#material>.image').hide(100);
        }
        // 图片
        else if (MsgType == 'image') {
          $('#material>.text').hide(100);
          $('#material>.news').hide(100);
          $('#material>.voice').hide(100);
          $('#material>.video').hide(100);
          $('#material>.image').show(100);
        }
      });
      // 防ipt-file div的事件
      $('#material .lable_file_ipt').off().on('click', function(e) {
        $('#' + me._MsgType + '_file').click();
        $('#' + me._MsgType + '_file')
          .off()
          .on("change", function() {
            var file_obj = $('#' + me._MsgType + '_file')[0].files[0];
            $(e.currentTarget).html(file_obj.name);
          });
      });
    },
    // 添加确认之前的验证
    add_yes_valid: function() {
      var me = this;
      var obj = {};

      var key = $('#key').val();
      var category = $('#category').val();
      var MsgType = $('#MsgType').val();

      // 文本
      if (MsgType == 'text') {
        var Content = $('#Content').val();
        obj = {
          key: key,
          category: category,
          MsgType: MsgType,
          Content: Content
        };
      }
      // 图文
      else if (MsgType == 'news') {
        var Title = $('#Title').val();
        var Description = $('#Description').val();
        var PicUrl = $('#PicUrl').val();
        var Url = $('#Url').val();
        obj = {
          key: key,
          category: category,
          MsgType: MsgType,
          Title: Title,
          Description: Description,
          PicUrl: PicUrl,
          Url: Url
        };
      }
      // 音频
      else if (MsgType == 'voice') {
        obj = {
          key: key,
          category: category,
          MsgType: MsgType,
          voice_file: $('#' + me._MsgType + '_file')[0].files[0]
        };
      }
      // 视频
      else if (MsgType == 'video') {
        var video_Title = $('#video_Title').val();
        var video_Description = $('#video_Description').val();
        obj = {
          key: key,
          category: category,
          MsgType: MsgType,
          video_Title: video_Title,
          video_Description: video_Description,
          video_file: $('#' + me._MsgType + '_file')[0].files[0]
        };
      }
      // 图片
      else if (MsgType == 'image') {
        obj = {
          key: key,
          category: category,
          MsgType: MsgType,
          image_file: $('#' + me._MsgType + '_file')[0].files[0]
        };
      }

      // 验证是否为空
      var formData = new FormData();
      for (var k in obj) {
        // 空
        if (!obj[k]) {
          layer.msg(k + '不能为空');
          return;
        }
        // 有
        else  {
          formData.append(k, obj[k]);
        }
      }
      console.log(obj);
      console.log(formData);
      return formData;
    },
    // 确认添加
    add_yes: function(index,load) {
      var me = this;

      // 验证后的信息
      var formData = me.add_yes_valid();
      // 提交
      $.ajax({
        url: me.API.add_temp,
        type: 'POST',
        data: formData,
        // 告诉jQuery不要去处理发送的数据
        processData: false,
        // 告诉jQuery不要去设置Content-Type请求头
        contentType: false,
        beforeSend: function() {},
        success: function(data) {
          if (data.ret) {
            layer.close(index);
            layer.close(load);
            me.datagrid.reload();
          }
        },
        error: function(data) {
          console.log("error");
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

      me.API.pc_login({
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
        me.url = me.API.material_list;
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
      me.datagrid =  me.list.datagrid({
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
