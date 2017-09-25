(function($, window) {
  function Main_html() {
    var me = this;

    me.set = {
      img_root: './img/bady/'
    }
  };
  Main_html.prototype = {
    init: function() {
      var me = this;
      // 
      me.event();

    },
    // 事件
    event: function() {
      var me = this;
      // 轮播图
      me._swiper();

      // 实时广告
      me._adv({
        parent: '#advp',
        son: '#adv'
      });

      // 支线任务
      setTimeout(function(argument) {
        me._adv({
          parent: '#lottery_p',
          son: '#lottery_s'
        });
      }, 2000);

      // nav
      var index = layer.load(0, { shade: 0.5 });
      me._nav();
      // 加载
      me._nav_load('main', index);



      // 收集微信用户
      me._wx_user(function() {
        // 统计数据
        me._hot();
        // 可以添加宝宝了
        me._add();
      });

      var str = `
      <div id="winner">
        <div class="title">
          恭喜您成为第${0}位投票者,</br>
          1、请用手机截图;</br>
          2、把截图发到朋友圈;</br>
          3、加管理员微信后，验证后可领取奖励;</br>
          <img src="./img/admin.jpg" style="width:65%;height:auto" /></br>
        </div>
        <input type="text" placeholder="请输入联系电话" id="winner_phone">
        <input type="text" placeholder="请输入昵称以进行全站广播" id="winner_name">
      </div>
      `;

      layer.open({
        title: '恭喜',
        area: ['90%', '85%'],
        shade: 0.6,
        closeBtn: 2,
        anim: 2,
        content: str,
        success: function(layero, index) {},
        btn: ['提交'],
        yes: function(index, layero) {
          me._add_yes(index);
        }
      });

    },
    // -----------------------------------广告区
    // 轮播图
    _swiper: function(argument) {
      var me = this;
      var mySwiper = new Swiper('.swiper-container', {
        //可选选项，自动滑动
        autoplay: 5000,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination',
        prevButton: '.swiper-button-prev',
        nextButton: '.swiper-button-next',
      });
    },
    // 实时广告
    _adv: function(obj) {
      var me = this;
      // 
      var parent_w = $(obj.parent).width();
      // 
      var son_w = $(obj.son).width();
      var son_left = $(obj.son).css('left');
      var arr = son_left.split("px");
      var son_active = arr[0] * 1;
      var son_traget = 0 - son_w - 10;

      if (parent_w > son_w) {
        return
      }
      // 设置移动动画时间
      var n = Math.ceil(son_w / parent_w);
      $(obj.son).css('transition', `left ${n*12}s linear`);

      // 开始移动
      setTimeout(function(argument) {
        $(obj.son).css('left', `${son_traget}px`);
      }, 200);

      // n个秒后重新执行
      setTimeout(function() {
        // 重置
        $(obj.son).css('transition', `left 0.01s linear`);

        $(obj.son).css('left', `${parent_w+10}px`);

        me._adv(obj);
      }, n * 13 * 1000);



      // return
      // setTimeout(function(argument) {
      //   // 字体长度小于屏幕宽
      //   if (W > w) {
      //     return;
      //   }
      //   // 字体长度大于屏幕宽
      //   else {
      //     // 没有达到目标
      //     if (active > traget) {
      //       var n = active - 10;

      //       me._adv();
      //     }
      //     // 达到目标
      //     else {
      //       $('#adv').css('left', `${W+10}px`);
      //       return
      //     }
      //   }
      // }, 302)
    },
    // -------------------------------------------------统计数据
    _hot: function() {
      var me = this;
      API.hot()
        .done(function(arr) {
          arr.forEach(function(item, index) {
            if (item.key == 'num') {
              $('#num').html(item.val)
            }
            if (item.key == 'vote') {
              $('#vote').html(item.val)
            }
            if (item.key == 'views') {
              $('#views').html(item.val)
            }
          });
        })
    },
    // -------------------------------------------------收集微信用户
    _wx_user: function(cb) {
      var me = this;
      // 用户信息
      var FromUserName = common_fn.getParam('FromUserName');

      API.wx_user({
          val: FromUserName,
          baby: 1
        })
        .done(function(data) {
          // 新增成功
          if (data.val) {
            // 记录微信用户
            me.wx_user_id = data.val;
            cb();
          }
        })
    },


    // -----------------------------------导航
    // nav
    _nav: function() {
      var me = this;
      $('#app>.nav>div').on('click', function(e) {
        // ------------css
        var class_key = $(e.currentTarget).hasClass('active');
        var attr_key = $(e.currentTarget).attr('key');

        if (class_key) {
          return
        }
        $('#app>.nav>div').removeClass('active');
        $(e.currentTarget).addClass('active');

        // 报名和热度框
        $('#apply,#hot').show();

        // 商家合作--报名和热度框
        if (attr_key == 'reg') {
          $('#apply,#hot').hide();
        }


        // -------------js
        var layer_load = layer.load(0, { shade: 0.5 });
        me._nav_load(attr_key, layer_load);
      })
    },
    // 菜单加载
    _nav_load: function(key, layer_load) {
      var me = this;
      me.key = key;
      $('#main').load(`./tpl/${key}.html`, function() {

        // 主页
        if (key == 'main') {
          // 数据列表
          me._main(layer_load);
        }
        // 排行列表
        else if (key == 'level') {
          me._level(layer_load);
        }
        // 赛事说明
        else if (key == 'info') {
          me._info(layer_load);
        }
        // 商家入口
        else if (key == 'reg') {

          me._reg(layer_load);
        }
      });
    },
    // -----------------------------------------------------报名入口
    _add: function() {
      var me = this;

      var str = `
      <div id="add_baby">
        <div>
          <div>宝宝姓名</div>
          <input type="text" placeholder="字数不超过6个字" id="baby_name">
        </div>
        <div>
          <div>家长姓名</div>
          <input type="text" placeholder="请输入家长姓名" id="p_name">
        </div>
        <div>
          <div>联系电话</div>
          <input type="text" placeholder="请输入联系电话" id="p_phone">
        </div>
        <div>
          <div>上传照片</div>
          <input type="file" id="baby_img">
        </div>
        <div class="info">
          上传图片大小不允超过1M</br>
          以上全部为必输入项
        </div>
      </div>
      `;

      $('#apply').on('click', function() {
        layer.open({
          title: '宝宝报名',
          area: ['90%', '50%'],
          shade: 0.6,
          closeBtn: 2,
          anim: 2,
          content: str,
          success: function(layero, index) {},
          btn: ['报名'],
          yes: function(index, layero) {
            me._add_yes(index);
          }
        });
      });
    },
    // 确认添加
    _add_yes: function(index) {
      var me = this;

      var baby_name = $('#baby_name').val();
      var p_name = $('#p_name').val();
      var p_phone = $('#p_phone').val();
      var baby_img = $('#baby_img')[0].files[0];
      // ---------------------------------------------
      if (!baby_name) {
        layer.tips('宝宝姓名必须填哦', '#baby_name', {
          tips: 1
        });
        return;
      }
      if (baby_name.length > 6) {
        layer.tips('宝宝名字太长咯', '#baby_name', {
          tips: 1
        });
        return;
      }
      // ----------------------------------
      if (!p_name) {
        layer.tips('家长姓名必须填哦', '#p_name', {
          tips: 1
        });
        return;
      }
      if (p_name.length > 6) {
        layer.tips('家长名字太长咯', '#baby_name', {
          tips: 1
        });
        return;
      }
      // ----------------------------------------
      if (!p_phone) {
        layer.tips('没有手机我们怎么联系您呢', '#p_phone', {
          tips: 1
        });
        return;
      }
      // if (p_phone.length != 11) {
      //   layer.tips('手机号不对哦', '#p_phone', {
      //     tips: 1
      //   });
      //   return;
      // }
      // ----------------------------------------
      if (!baby_img) {
        layer.tips('没有照片参考不了比赛哦', '#baby_img', {
          tips: 1
        });
        return;
      }
      if (baby_img.size > 1 * 1024 * 1024) {
        layer.tips('照片超过1M咯', '#baby_img', {
          tips: 1
        });
        return;
      }
      if (baby_img.name.split('.').length != 2) {
        layer.tips('照片名字不能含有 . 哦~~', '#baby_img', {
          tips: 1
        });
        return;
      }
      // ---------------------------------------------


      var obj = {
        baby_name: baby_name,
        p_name: p_name,
        p_phone: p_phone,
        baby_img: baby_img,
      };
      var formData = new FormData();

      for (var k in obj) {
        formData.append(k, obj[k]);
      }

      API.add_baby(formData)
        .done(function(data) {
          if (data._id) {

            layer.msg('宝宝报名成功');
            layer.close(index);

            // 事件完成后的函数
            me._event_done();
          }
        });
    },
    // 事件完成后的函数
    _event_done: function(argument) {
      var me = this;
      // 统计数据
      me._hot();

      // 加载
      var layer_load = layer.load(0, { shade: 0.5 });
      if (me.key == 'main') {
        // 数据列表
        me._main(layer_load);
      }
      // 排行列表
      else if (me.key == 'level') {
        me._level(layer_load);
      }
      // 赛事说明
      else if (me.key == 'info') {
        me._info(layer_load);
      }
      // 商家入口
      else if (me.key == 'reg') {

        me._reg(layer_load);
      }
    },
    // ----------------------------------------------------主页展示
    // 数据展示
    _main: function(layer_load) {
      var me = this;
      // 展示列表
      me._mian_list(1, layer_load);
      // 分页按钮事件
      me._page_event();
      // 投票行为
      me._vote_event();
    },
    // 展示列表
    _mian_list: function(page, layer_load) {
      var me = this;

      // 请求数据列表
      API.list({
          rows: 10,
          page: page
        })
        .done(function(data) {
          // 列表渲染
          me._mian_list_draw(data.rows, layer_load);
          // 分页渲染
          me._mian_list_page(page, data.total);

        });
    },
    // 列表绘制
    _mian_list_draw: function(arr, layer_load) {
      var me = this;
      var str = "";
      $('#device').html(str);

      str = `<div class="galcolumn" id="galcolumn">`;

      arr.forEach(function(item, index) {
        str += `
        <div class="item">
          <img src="${me.set.img_root}${item.baby_img}" />
          <div>
            <div>${item.baby_id}号 ${item.baby_name}</div>
            <div>
              <div>${item.vote}票</div>
              <div class='click_vote' key='${item.baby_id}'>投一票</div>
            </div>
          </div>
        </div>
        `;
      });

      str += `</div>`;

      $('#device').html(str);


      var width = $('#app>.main>.list').width();
      //主要部分
      $("#device").gridalicious({
        // 间距
        gutter: 3,
        // 宽度
        width: (width - 80) / 2,
        animate: true,
        animationOptions: {
          speed: 150,
          duration: 400,
          // 预先设置完的图片加载完的回调函数
          complete: function(data) {
            // 加载回来的数据
            // console.log(data);
            layer.close(layer_load);
          },
        },
      });
    },
    // 翻页数据渲染
    _mian_list_page: function(page, total) {
      var me = this;
      // 当前页
      $('#active_page').html(page);
      // 总页数
      $('#all_page').html(Math.ceil(total / 10));
    },
    // -----------------------------分页点击行为
    _page_event: function() {
      var me = this;
      var page = null;
      // 上一页
      $('#pre_page').off().on('click', function() {
        if ($('#active_page').html() == 1) {
          layer.msg('已到第一页');
          return
        }
        page = $('#active_page').html() * 1 - 1;
        $('#active_page').html(page);
        me._mian_list(page, layer.load(0, { shade: 0.5 }));
      });

      // 下一页
      $('#next_page').off().on('click', function() {
        if ($('#active_page').html() == $('#all_page').html()) {
          layer.msg('已到最后一页');
          return
        }
        page = $('#active_page').html() * 1 + 1;
        $('#active_page').html(page);
        me._mian_list(page, layer.load(0, { shade: 0.5 }));
      });
    },
    // -----------------------------投票行为
    _vote_event: function() {
      var me = this;
      var baby_id = null;
      $('#device').off().on('click', '.click_vote', function(e) {
        // 拿到babyid
        baby_id = $(e.currentTarget).attr('key');
        API.vote({
            baby_id: baby_id,
            wx_user_id: me.wx_user_id
          })
          .done(function(data) {
            if (data.ret == 0) {
              layer.msg('投票成功');

              // 事件完成后的函数
              me._event_done();
            }
            // 超过上限
            else if (data.ret == -1) {
              layer.msg('你捏今天的投票次数用完咯，请明儿再闹哇~~');
            }
            // 中奖
            else {

              var str = `
                  <div id="winner">
                    <div class="title">
                      恭喜您成为第${data.ret}位投票者，请及时截图以及完成以下
                    </div>
                    <input type="text" placeholder="请输入联系电话" id="winner_phone">
                  </div>
                  `;

              layer.open({
                title: '恭喜',
                area: ['90%', '50%'],
                shade: 0.6,
                closeBtn: 2,
                anim: 2,
                content: str,
                success: function(layero, index) {},
                btn: ['提交'],
                yes: function(index, layero) {
                  me._add_yes(index);
                }
              });
            }
          })
      });
    },














    // -----------------------------------排行信息
    _level: function(layer_load) {
      var me = this;
      layer.close(layer_load);
    },
    // -----------------------------------赛事说明
    _info: function(layer_load) {
      var me = this;
      layer.close(layer_load);
    },
    // -----------------------------------商家入口
    _reg: function(layer_load) {
      var me = this;
      layer.close(layer_load);
    },

  };
  conf.module["Main_html"] = Main_html;
})(jQuery, window);
