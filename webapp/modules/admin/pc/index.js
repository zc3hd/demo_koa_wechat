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
      // 侧边栏导航
      me.nav();

      // 列表事件
      me.event();

      // login
      // me.login();
    },
    // ---------------------------------------------event
    event: function() {
      var me = this;
      // 
      me.add();
      // 
      me.upd();
      // 
      me.del();
    },
    // 新增
    add: function() {
      var me = this;
      $('#main .add').off().on('click', function(argument) {
        // 素材
        if (me.key == 'material') {
          me.add_material();
        }
      });
    },
    // 修改
    upd: function() {
      var me = this;
      $('#main .upd').off().on('click', function(argument) {
        // 素材
        if (me.key == 'material') {
          me.upd_material();
        }
      });
    },
    // 删除
    del: function() {
      var me = this;
      $('#main .del').off().on('click', function(argument) {
        // 素材
        if (me.key == 'material') {
          me.del_material();
        }
      });
    },
    // ----------------------------------------------素材管理
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
              <option value='web'>web</option>
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
        area: ['80%', '350px'],
        anim: 1,
        shade: 0.6,
        content: str,
        btn: ['add'],
        success: function(layero, index) {
          // 添加素材弹窗的一些事件
          me.add_material_load_event();
        },
        yes: function(index, layero) {
          var load = layer.load();
          me.add_material_yes()
            .done(function(data) {
              if (data.ret) {
                layer.close(index);
                layer.close(load);
                me.list.datagrid('reload');
              }
            });
        },
        btn2: function(index, layero) {},
      });
    },
    // 添加素材弹窗的一些事件
    add_material_load_event: function() {
      var me = this;
      // 默认是选了text
      me._MsgType = "text";
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
          // 默认选择是text
          me._MsgType = "text";
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
          // 默认选择是text
          me._MsgType = "voice";
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
          // 默认选择是news
          me._MsgType = "news";
        }
        // web
        else if (category == 'web') {
          // 类型--没有了
          $('#material>.MsgType').hide(100);
          // 输入区--默认图文
          $('#material>.voice').hide(100);
          $('#material>.video').hide(100);
          $('#material>.image').hide(100);
          // 
          $('#material>.text').hide(100);
          $('#material>.news').show(100);
          // news
          me._MsgType = "news";
        }
      });
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
      // 仿ipt-file的 div事件
      $('#material .lable_file_ipt').off().on('click', function(e) {
        $('#' + me._MsgType + '_file').click();
        $('#' + me._MsgType + '_file').off().on("change", function() {
          var file_obj = $('#' + me._MsgType + '_file')[0].files[0];
          $(e.currentTarget).html(file_obj.name);
        });
      });
    },
    // 添加确认之前的验证
    add_material_yes_valid: function() {
      var me = this;
      var obj = {};
      var key = $('#key').val();
      var category = $('#category').val();
      var MsgType = me._MsgType;
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
        else {
          formData.append(k, obj[k]);
        }
      }
      // 临时文件
      if (MsgType == ('voice' || 'video' || 'image')) {
        return formData;
      }
      // 本地预设或者SDK
      else {
        return obj;
      }
    },
    // 确认添加
    add_material_yes: function() {
      var me = this;
      // 验证后的信息
      var formData = me.add_material_yes_valid();

      // return
      // 
      // 临时文件
      if (!formData.MsgType) {
        return me.API.add_temp(formData);
      }
      // 本地预设 文本或静态图文 或SDK
      else {
        var load = layer.load();
        return me.API.add_text_news(formData)
        .done(function(data){
          if (data.ret) {
          layer.close(load);
          me.list.datagrid('reload');
          }
        });
      }
    },
    // 删除素材
    del_material: function() {
      var me = this;
      // 选择到一条数据
      me.row = me.list.datagrid('getSelected');
      // 没有选数据
      if (!me.row) {
        layer.msg('请选择一条数据');
        return
      }
      var load = layer.load();
      me.API.del_material({
        key: me.row.key,
        MsgType:JSON.parse(me.row.val).MsgType
      }).done(function(data) {
        if (data.ret) {
          layer.close(load);
          me.list.datagrid('reload');
        }
      })
    },
    // 修改素材
    upd_material: function() {
      var me = this;
      // 选择到一条数据
      me.row = me.list.datagrid('getSelected');
      // 没有选数据
      if (!me.row) {
        layer.msg('请选择一条数据');
        return
      }


      var val = JSON.parse(me.row.val);
      var MsgType = val.MsgType;
      // 只能修改图文
      if (MsgType != "news") {
        layer.msg('只能修改图文')
        return
      }


      var str = `
      <div id="material">
        <div>
          <div class="middle info">key</div>
          <div class="middle ipt">
            <input type="text" id="key" placeholder="key" value="${me.row.key}">
          </div>
        </div>
        
        <!-- 图文 -->
        <div class="news">
          <div class="middle info">Title</div>
          <div class="middle ipt">
            <input type="text" id="Title" placeholder="Title" value="${val.Articles[0].Title}">
          </div>
        </div>
        <div class="news">
          <div class="middle info">Description</div>
          <div class="middle ipt">
            <input type="text" id="Description" placeholder="Description" value="${val.Articles[0].Description}">
          </div>
        </div>
        <div class="news">
          <div class="middle info">PicUrl</div>
          <div class="middle ipt">
            <input type="text" id="PicUrl" placeholder="PicUrl" value="${val.Articles[0].PicUrl}">
          </div>
        </div>
        <div class="news"> 
          <div class="middle info">Url</div>
          <div class="middle ipt">
            <input type="text" id="Url" placeholder="Url" value="${val.Articles[0].Url}">
          </div>
        </div>
      </div>
      `;

      layer.open({
        type: 1,
        title: 'upd material',
        area: ['80%', '300px'],
        anim: 1,
        shade: 0.6,
        content: str,
        btn: ['upd'],
        success: function(layero, index) {
          $('#material>.news').show(100);
        },
        yes: function(index, layero) {
          var load = layer.load();
          me.API.upd_news({
              _id: me.row._id,
              key: $('#key').val(),
              MsgType: MsgType,
              Title: $('#Title').val(),
              Description: $('#Description').val(),
              PicUrl: $('#PicUrl').val(),
              Url: $('#Url').val(),
            })
            .done(function(data) {
              if (data.ret) {
                layer.close(index);
                layer.close(load);
                me.list.datagrid('reload');
              }
            });
        },
        btn2: function(index, layero) {},
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
      // 关键字全局挂载
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
      }).done(function(data) {
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
          [{
              field: 'id',
              checkbox: true,
              width: "10%"
            },
            // key
            {
              field: 'key',
              title: 'key',
              width: '10%'
            },
            // 类型
            {
              field: '_id',
              title: 'val',
              width: '25%',
              formatter: function(value, row, index) {
                var val = JSON.parse(row.val);
                var str = ''
                // 图文
                if (val.MsgType == 'news') {
                  str = val.Articles[0].Url;
                } 
                // 文本
                else if (val.MsgType == 'text') {
                  str = val.Content;
                }
                return str;
              }
            },
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
            {
              field: 'category',
              title: 'category',
              width: '20%'
            },
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
            $('.datagrid-view').append('<div id = "hasNoneData" style="text-align:center;padding-top:40px;" class="searchnodata">没有找到相关记录</div>');
          }
        },
      });
    },
  };
  conf.module["Admin"] = Admin;
})(jQuery, window);
