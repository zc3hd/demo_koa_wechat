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

      // 顶部广告
      me._top_adv();

      // 支线任务
      me._branch_adv();

      // 获得者提醒
      me._winner_tips();

      // nav
      me._nav('main');

      // 收集微信用户
      me._wx_user(function() {
        // 统计数据
        me._hot();
        // 可以添加宝宝了
        me._add();
      });



    },
    // ------------------------------------------------广告区
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
    // 顶部实时广告
    _top_adv: function() {
      var me = this;

      me._adv({
        parent: '#advp',
        son: '#adv'
      });
    },


    // --------------------------------------------------获得者的提醒
    _winner_tips: function() {
      var me = this;
      API.wx_winner_tips()
        .done(function(data) {
          // 有获得者广播一天
          if (data.winner == 1) {
            me._winner_tips_yes(data);
          }
          var str = `【全民支线任务】为感谢天镇县广大父老乡亲对的本平台的支持，本平台现在开启支线任务，即：本站的第${data.level}位投票朋友，可获得${data.pay}元微信现金红包，赶快吆喝人们来成为第${data.level}位投票的支持者吧~~`;
          // 信息html注入
          $('#lottery_s').html(str);
          // 开启支线任务
          me._branch_adv(data);
        });
    },
    // 有获得者
    _winner_tips_yes: function(data) {
      var me = this;
      var info = JSON.parse(data.info);
      var str = `
      <div id="winner" class="winner_tips" style="color: #fff;">
        <div class="title">
          恭喜<span> ${info.nickname} </span>成为<span> 第${info.level}位 </span>投票者</br>
          获得支线任务<span> ${info.pay}元 </span>微信现金红包</br>
          <img src="./img/hb.jpg" style="width:55%;height:auto" /></br>
          （后续任务已开启，快活动起来吧）</br>
        </div>
      </div>
      `;

      layer.open({
        title: `恭喜${info.nickname}`,
        area: ['90%', '65%'],
        shade: 0.6,
        closeBtn: 2,
        anim: 2,
        content: str,
        success: function(layero, index) {},
        btn: ['恭喜'],
        yes: function(index, layero) {
          layer.close(index);
        }
      });
    },
    // 开启支线广告
    _branch_adv: function(data) {
      var me = this;
      // 支线任务
      setTimeout(function() {
        me._adv({
          parent: '#lottery_p',
          son: '#lottery_s',
        });
      }, 2000);
    },
    // 广告
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


    // ------------------------------------------------导航
    // nav
    _nav: function(key) {
      var me = this;
      // 加载
      me._nav_load(key, layer.load(0, { shade: 0.5 }));
      // 点击事件
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
      });
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
      if (p_phone.length > 11) {
        layer.tips('手机号不对哦', '#p_phone', {
          tips: 1
        });
        return;
      }
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
    // -----------------------------------------------------事件完成后的函数
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

    // ------------------------------------------------------------------主页展示
    // 数据展示
    _main: function(layer_load) {
      var me = this;
      // 展示列表
      me._mian_list(1, layer_load);
      // 分页按钮事件
      me._page_event();
      // 投票行为
      me._vote_event();
      // 搜索宝宝
      me._search();
    },
    // ------------------------------------------展示列表
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
    // ------------------------------------------分页点击行为
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
    // ------------------------------------------投票行为
    _vote_event: function() {
      var me = this;
      var baby_id = null;
      $('#device').off().on('click', '.click_vote', function(e) {
        // 拿到babyid
        baby_id = $(e.currentTarget).attr('key');
        me._vote_event_ajax(baby_id);
      });
    },
    // 投票行为ajax
    _vote_event_ajax: function(baby_id) {
      var me = this;
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
            me._vote_winner_one(data);
          }
        })
    },
    // 支线任务截图一
    _vote_winner_one: function(data) {
      var me = this;
      var str = `
      <div id="winner">
        <div class="title">
          恭喜您成为第${data.ret}位投票者</br>
          获得【支线任务】${data.pay}元微信现金红包</br>
          请用手机截图</br>
        </div>
      </div>
      `;

      layer.open({
        title: '恭喜恭喜，晚上吃鸡',
        area: ['90%', '40%'],
        shade: 0.6,
        closeBtn: 2,
        anim: 2,
        content: str,
        success: function(layero, index) {},
        btn: ['已截图'],
        yes: function(index, layero) {
          layer.close(index);
          me._vote_winner_two(data);
        }
      });
    },
    // 支线任务截图2
    _vote_winner_two: function(echo) {
      var me = this;
      var str = `
      <div id="winner">
        <div class="title">
          【记住以下两步骤，该页面关闭后不再显示】</br>
          1、把刚才截图发到朋友圈;</br>
          2、加管理员微信后，验证后可领取奖励;</br>
          <img src="./img/admin.jpg" style="width:65%;height:auto" /></br>
        </div>
        <input type="text" placeholder="请输入联系电话" id="winner_phone">
        <input type="text" placeholder="请输入昵称以进行全站广播" id="winner_name">
      </div>
      `;

      layer.open({
        title: '恭喜恭喜，晚上吃鸡',
        area: ['90%', '85%'],
        shade: 0.6,
        closeBtn: 2,
        anim: 2,
        content: str,
        success: function(layero, index) {},
        btn: ['我记住了'],
        yes: function(index, layero) {
          // layer.close(index);
          me._vote_winner_done(index, echo);
        }
      });
    },
    // 截图完成
    _vote_winner_done: function(index, echo) {
      var me = this;

      if ($('#winner_name').val().length > 6) {
        layer.tips('昵称太长咯', '#winner_name', {
          tips: 1
        });
        return;
      }
      if ($('#winner_phone').val().length > 11) {
        layer.tips('手机号太长了', '#winner_phone', {
          tips: 1
        });
        return;
      }

      API.wx_winner({
          level: echo.ret,
          pay: echo.pay,
          phone: $('#winner_phone').val(),
          nickname: $('#winner_name').val()
        })
        .done(function(data) {
          if (data.ret == 1) {
            layer.close(index);
            // 事件完成后的函数
            me._event_done();
          }
        })
    },
    // ------------------------------------------搜索宝宝
    _search: function(argument) {
      var me = this;
      $('#search').off().on('click', function(argument) {
        var baby_id = $('#search_num').val();
        if (!baby_id) {
          layer.tips('没有编号怎么搜索呢', '#search_num', {
            tips: 1
          });
          return;
        }
        me._search_done(baby_id);
      });
    },
    // 进行搜索
    _search_done: function(baby_id) {
      var me = this;
      API.search({
        baby_id: baby_id
      }).done(function(data) {
        if (data.ret == -1) {
          $('#search_num').val("");
          layer.tips('未搜索到您输入的编号~~', '#search_num', {
            tips: 1
          });
        }
        // 找到宝宝
        else {
          me._search_yes(data)
        }
      });
    },
    // 收到数据
    _search_yes: function(data) {
      var me = this;
      var str = `
      <div class="search_baby">
        <div>
        ${data.baby_id}号 ${data.baby_name}
        </div>
        <div>
          <img src="./img/bady/${data.baby_img}" style="width:95%;height:auto" />
        </div>
        <div>
          目前票数：${data.vote} 票
        </div>
      </div>
      `;
      layer.open({
        title: data.baby_name + " 信息",
        area: ['90%', '80%'],
        shade: 0.6,
        closeBtn: 2,
        anim: 2,
        content: str,
        success: function(layero, index) {},
        btn: ['投票'],
        yes: function(index, layero) {
          layer.close(index);
          me._vote_event_ajax(data.baby_id);
        }
      });
    },
    // ------------------------------------------------------------------排行信息
    _level: function(layer_load) {
      var me = this;
      layer.close(layer_load);
      // 展示
      me._level_list();
    },
    // 列表请求
    _level_list: function() {
      var me = this;
      API.level_list()
        .done(function(data) {
          // 宝座渲染
          me._level_draw(data);
          // 列表渲染
          me._level_list_draw(data);

          // 投票事件
          me._level_list_vote();
        });
    },
    // 当前宝座
    _level_draw: function(arr) {
      var me = this;
      var str = '';
      str += `
      <div>当前宝座</div>
      `;
      $('#active_level').html(str);

      var tip = '';
      for (var k = 0; k <= 2; k++) {
        if (k == 0) {
          tip = 'icon-guanjun';
        }
        if (k == 1) {
          tip = 'icon-yajun';
        }
        if (k == 2) {
          tip = 'icon-jijun';
        }
        str += `
        <div class="item">
          <span class="icon iconfont ${tip}"></span>
          <div class="img">
            <img src="./img/bady/${arr[k].baby_img}" alt="">
          </div>
          <div class="info">
            <div>${arr[k].baby_name}</div>
            <div>${arr[k].vote}</div>
          </div>
        </div>
        `;
      }
      $('#active_level').html(str);
    },
    // 列表渲染
    _level_list_draw: function(arr) {
      var me = this;
      var str = '';

      str += `
      <div class="item title">
        <div>排名</div>
        <div>宝名</div>
        <div>宝宝票数</div>
        <div>投票</div>
      </div>
      `;
      $('#level_list').html(str);
      arr.forEach(function(item, index) {
        str += `
        <div class="item">
          <div>${index+1}</div>
          <div>${item.baby_name}</div>
          <div>${item.vote} 票</div>
          <div>
            <div key ="${item.baby_id}" class="click_vote">投票</div>
          </div>
        </div>
        `;
      });
      $('#level_list').html(str);
    },
    // 排名投票事件
    _level_list_vote: function() {
      var me = this;
      var baby_id = null;
      $('#level_list').off().on('click', '.click_vote', function(e) {
        // 拿到babyid
        baby_id = $(e.currentTarget).attr('key');
        me._vote_event_ajax(baby_id);
      });
    },
    // ------------------------------------------------------------------赛事说明
    _info: function(layer_load) {
      var me = this;
      layer.close(layer_load);

      // 活动时间
      me._info_ajax();
    },
    // 活动信息
    _info_ajax: function() {
      var me = this;
      API.info()
        .done(function(data) {
          var start = common_fn.formatterDateDay(data.start, true);
          var end = common_fn.formatterDateDay(data.end, true);
          $('#doing').html(`活动时间：${start} 至 ${end}`);

          // 0
          var notice = "";
          if (!data.notice) {
            notice = "待定";
          } else {
            notice = common_fn.formatterDateDay(data.notice, true);
          }
          $('#notice').html(`名单公布：${notice}`);

          // 0
          var receive = "";
          if (!data.receive_start) {
            receive = "待定";
          } else {
            receive = common_fn.formatterDateDay(data.receive_start, true) + " 至 " + common_fn.formatterDateDay(data.receive_end, true);
          }
          $('#receive').html(`奖品领取：${receive}`);

          // 活动奖项
          $('#guan').html(data.guan);
          $('#ya').html(data.ya);
          $('#ji').html(data.ji);
          $('#renqi').html(data.renqi);

        });
    },
    // -----------------------------------商家入口
    _reg: function(layer_load) {
      var me = this;
      layer.close(layer_load);
      
      // me._reg_other_teamwork();
    },


  };
  conf.module["Main_html"] = Main_html;
})(jQuery, window);
