(function($, window) {
  function Main_html() {
    var me = this;

    // 主页列表数据加载显示开关
    me.main_list_key = false;

    // 路径配置
    me.set = {
      img_root: './img/bady/'
    };
  };
  Main_html.prototype = {
    init: function() {
      var me = this;

      // 访问量计算
      me._views();

      // 轮播图
      me._swiper();

      // 顶部广告
      me._top_adv();

      // 支线任务
      me._branch_adv();

      // 获得者提醒
      me._winner_tips();

      // 获取过期时间
      me._time_end(function(){
        // nav
        me._nav('main');
      });

    },
    // 获取过期时间
    _time_end:function(cb){
      var me = this;
      API.time_end()
        .done(function(data){
          // 过期时间
          me.expires_in = data.expires_in;
          cb();
        });
    },
    // 访问量计算
    _views: function() {
      var me = this;
      API.views()
        .done(function(data) {

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
          // 有获得者--广播一天
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
        offset: '35px',
        title: `恭喜${info.nickname}`,
        area: ['90%', '478px'],
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
    // 开启支线任务
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
      // 父级的宽度
      var parent_w = $(obj.parent).width();
      // 儿子的宽度
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

        // 推迟执行
        setTimeout(function(){
          $(obj.son).css('left', `${parent_w+10}px`);
        },200);
        
        setTimeout(function(){
          me._adv(obj);
        },1000);
      }, n * 13 * 1000);
    },
    // ---------------------------------------------事件完成后的函数
    // 加载层
    _load: function() {
      return layer.load(0, { shade: 0.5 });
    },
    // 事件完成后的所加载的事件
    _event_done: function(argument) {
      var me = this;
      // 加载
      var layer_load = me._load();
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
    // ------------------------------------------------导航
    // nav
    _nav: function(key) {
      var me = this;
      // 加载
      me._nav_load(key, me._load());
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

        // -------------js
        me._nav_load(attr_key, me._load());
      });
    },
    // 菜单加载
    _nav_load: function(key, layer_load) {
      var me = this;
      me.key = key;
      $('#main').load(`./tpl/${key}.html`, function() {

        // 主页
        if (key == 'main') {
          // 主页列表数据加载显示开关
          me.main_list_key = false;
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
    // ------------------------------------------------------------------主页展示
    // 数据展示
    _main: function(layer_load) {
      var me = this;

      var load_add = me._load();
      // 收集微信用户
      me._wx_user(function() {
        // 统计数据
        me._hot();
        // 可以添加宝宝了（或者是宝宝的数据）
        me._add();

        layer.close(load_add);
      });

      // 展示列表
      me._mian_list(1, layer_load);

      // 投票行为
      me._list_vote_event();

      // 分页按钮事件
      me._page_event();


      // 搜索宝宝
      me._search();

      // 重新搜索搜索
      if ($('#search_num').val()) {
        // 重新搜索数据
        me._search_done($('#search_num').val());
      }
    },
    // ---------------------------------------------收集微信用户
    _wx_user: function(cb) {
      var me = this;
      // 用户信息
      var FromUserName = common_fn.getParam('FromUserName');

      API.wx_user({
          val: FromUserName,
        })
        .done(function(data) {
          // 记录微信用户
          me.wx_user_id = data.wx.val;

          // 微信的报名baby
          me.wx_baby = data.baby;

          // 排名
          me.wx_baby_level = data.level;

          cb();
        });
    },
    // --------------------------------------------统计数据
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
    // --------------------------------------------报名入口（或展示自己的宝宝）
    _add: function() {
      var me = this;
      // --------------------------没有报名
      if (!me.wx_baby) {
        // 标题
        $('#apply_title').html('宝宝报名入口');

        // 具体信息隐藏
        $('#app>.main>.wx_baby').hide();


        // 报名入口点击事件
        $('#apply').off().on('click', function() {
          // 过期
          if (new Date().getTime()>me.expires_in) {
            layer.msg('活动日期已经截止咯~~');
          }
          // 没有过期
          else{
            // 具体信息显示
            $('#app>.main>.add_bb_input').show(200);
            // 提交信息按钮
            $('#btn_add_bb').off().on('click',function(){
              // 提交信息事件
              me._add_yes();
            });
          }
        });
      }
      // ---------------------------已经报名
      else {
        // 取消报名事件
        $('#apply').off();
        // 标题
        $('#apply_title').html(`您家宝宝 ${me.wx_baby.baby_id}号 ${me.wx_baby.baby_name}`);

        // 具体信息显示
        $('#app>.main>.wx_baby').show();

        // 票数
        $('#wx_baby_vote').html(me.wx_baby.vote);

        // 排名
        $('#wx_baby_level').html(me.wx_baby_level);

        // 绑定ID
        $('#wx_one_vote').attr('key', me.wx_baby.baby_id);

        // 单独投票行为
        me._vote_yes();
      }
    },
    // 没有报名的--确认添加
    _add_yes: function() {
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
      if (p_phone.length != 11) {
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
      // cons(baby_img);
      var imgs = baby_img.name.split('.');
      // 名字中间不能有点
      if (imgs.length != 2) {
        layer.tips('照片名字不能含有[.]哦~~', '#baby_img', {
          tips: 1
        });
        return;
      }
      // 文件类型确认
      if ((imgs[1].toLowerCase() == 'jpg') || (imgs[1].toLowerCase() == 'png')||(imgs[1].toLowerCase() == 'jpeg')) {
        
      }
      else{
        layer.tips('照片类型必须为jpg、jpeg、png', '#baby_img', {
          tips: 1
        });
        return;
      }

      // ---------------------------------------------
      var obj = {
        // 绑定到当前微信用户上
        wx_user_id: me.wx_user_id,
        baby_name: baby_name,
        p_name: p_name,
        p_phone: p_phone,
        baby_img: baby_img,
      };
      var formData = new FormData();

      for (var k in obj) {
        formData.append(k, obj[k]);
      }

      // load
      me.layer_load = me._load();
      API.add_baby(formData)
        .done(function(data) {
          // 报名成功
          if (data._id) {

            layer.msg('宝宝报名成功');
            // 报名窗口隐藏
            $('#add_bb_input').hide(50);

            // 关闭加载层
            layer.close(me.layer_load);

            // 事件完成后的函数
            me._event_done();
          }
          // 报名失败
          else if (data.ret==-1) {
            layer.msg('已经超过报名的时间了');
            // 关闭加载层
            layer.close(me.layer_load);
          }
        });
    },
    // 已经报名的--单独投票行为
    _vote_yes: function() {
      var me = this;
      var baby_id = null;
      $('#wx_one_vote').off().on('click', function(e) {
        // 拿到babyid
        baby_id = $(e.currentTarget).attr('key');
        me.baby_id = baby_id;
        me._vote_event_ajax(baby_id);
      });
    },
    // 投票完成后直接修改列表的数据
    _vote_done_list: function(vote) {
      var me = this;
      var str = $('#cc_' + me.baby_id).html();

      // 不在页面内
      if (!str) {
        return;
      }
      // 在页面内
      else {
        $('#cc_' + me.baby_id).html(`${vote}票`);
      }
    },
    // ------------------------------------------展示列表
    _mian_list: function(page, layer_load) {
      var me = this;

      // 没有加载数据
      if (!me.main_list_key) {
        // 请求数据列表
        API.list({
            rows: 10,
            page: page
          })
          .done(function(data) {
            // 列表渲染
            me._mian_list_draw(data.rows, layer_load);
            // 分页渲染--(页码/总页数)
            me._mian_list_page(page, data.total);
            // 主页列表显示开关
            me.main_list_key = true;
          });
      }
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
              <div id='cc_${item.baby_id}'>${item.vote}票</div>
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
        // 恢复没有加载过数据
        me.main_list_key = false;
        page = $('#active_page').html() * 1 - 1;
        $('#active_page').html(page);
        me._mian_list(page, me._load());
      });

      // 下一页
      $('#next_page').off().on('click', function() {
        if ($('#active_page').html() == $('#all_page').html()) {
          layer.msg('已到最后一页');
          return
        }
        // 恢复没有加载过数据
        me.main_list_key = false;

        page = $('#active_page').html() * 1 + 1;
        $('#active_page').html(page);
        me._mian_list(page, me._load());
      });
    },
    // ------------------------------------------列表投票行为
    _list_vote_event: function() {
      var me = this;
      var baby_id = null;
      // 列表中的投票按钮
      $('#device').off().on('click', '.click_vote', function(e) {
        // 拿到babyid
        baby_id = $(e.currentTarget).attr('key');

        // 记住这个ID
        me.baby_id = baby_id;
        // 投票行为ajax
        me._vote_event_ajax(baby_id);
      });
    },
    // 投票行为ajax
    _vote_event_ajax: function(baby_id) {
      var me = this;
      // 过期
      if (new Date().getTime()>me.expires_in) {
        layer.msg('投票已经截止咯~~');
      }
      // 没有过期
      else{
        me.layer_load = me._load();
        API.vote({
            baby_id: baby_id,
            wx_user_id: me.wx_user_id
          })
          .done(function(data) {
            layer.close(me.layer_load);
            // 正常投票
            if (data.ret == 0) {
              layer.msg('投票成功');

              // 事件完成后的函数
              me._event_done();

              // 投票完成后直接修改列表的数据
              me._vote_done_list(data.vote)
            }
            // 超过微信用户的投票上限
            else if (data.ret == -1) {
              layer.msg('你捏今天的投票次数用完咯，请明儿再闹哇~~');
            }
            // 微信用户中奖的显示
            else {
              me._vote_winner_one(data);
            }
          });
      }
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
        offset: '35px',
        title: '大吉大利，晚上吃鸡',
        area: ['90%', '285px'],
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
      // 获得者信息收集的窗口
      $('#winner_ipt').show(200);
      // 提交信息
      $('#winner_btn').off().on('click',function(){
        me._vote_winner_done(me._load(), echo);
      });
    },
    // 截图完成
    _vote_winner_done: function(index, echo) {
      var me = this;

      if ($('#winner_name').val().length > 6) {
        layer.tips('昵称太长咯', '#winner_name', {
          tips: 1
        });
        layer.close(index);
        return;
      }
      if ($('#winner_phone').val().length != 11) {
        layer.tips('您输入的不是11位的电话号码哦~', '#winner_phone', {
          tips: 1
        });
        layer.close(index);
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
            // 收集框消失
            $('#winner_ipt').hide(200);
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
      me.layer_load = me._load();
      API.search({
        baby_id: baby_id
      }).done(function(data) {
        console.log(data);
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
        layer.close(me.layer_load);
      });
    },
    // 搜索到数据
    _search_yes: function(data) {
      var me = this;
      $('#search_baby_info').show(200);
      $('#search_baby_name').html(`${data.baby.baby_name}`);
      $('#search_baby_vote').html(`${data.baby.vote}`);
      $('#search_baby_level').html(`${data.level}`);

      // 绑定ID
      $('#search_one_vote').attr('key', data.baby.baby_id);

      // me.search_baby_id = data.baby.baby_id;
      // 单独投票行为
      me._search_vote_yes();
    },
    // 单独投票行为
    _search_vote_yes: function() {
      var me = this;
      var baby_id = null;
      $('#search_one_vote').off().on('click', function(e) {
        // 拿到babyid
        baby_id = $(e.currentTarget).attr('key');
        me.baby_id = baby_id;
        me._vote_event_ajax(baby_id);
      });
    },
    // ------------------------------------------------------------------排行信息
    _level: function(layer_load) {
      var me = this;
      // 展示
      me._level_list(layer_load);
    },
    // 列表请求
    _level_list: function(layer_load) {
      var me = this;
      API.level_list()
        .done(function(data) {
          // 宝座渲染
          me._level_draw(data);
          // 列表渲染
          me._level_list_draw(data);

          // 投票事件
          me._level_list_vote();

          layer.close(layer_load);
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
            <div>${arr[k].baby_id}号 ${arr[k].baby_name}</div>
            <div>${arr[k].vote} 票</div>
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
          <div>${item.baby_id}号-${item.baby_name}</div>
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
      // 活动信息
      me._info_ajax(layer_load);
    },
    // 活动信息
    _info_ajax: function(layer_load) {
      var me = this;
      API.info()
        .done(function(data) {
          var start = common_fn.formatterDateDay(data.start, true);

          // 0
          var end = "";
          if (!data.end) {
            notice = "待定";
          } else {
            end = common_fn.formatterDateDay(data.end, true);
          }
          
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

          layer.close(layer_load);
        });
    },
    // -------------------------------------------------------------------商家入口
    _reg: function(layer_load) {
      var me = this;
      layer.close(layer_load);
      // 时间加载
      me._date(['#business_beginTime'])

      // 其他合作方式
      me._reg_other();

      // 顶部合作
      me._reg_top();

      // 
      me._baby_talk();
    },
    // 日期加载
    _date: function(arr) {
      var me = this;

      // 开始时间
      var start = {
        //需显示日期的元素选择器
        elem: arr[0],
        event: 'click', //触发事件
        // format: 'YYYY-MM-DD hh:mm:ss', //日期格式
        format: 'YYYY-MM-DD', //日期格式
        istime: false, //是否开启时间选择
        isclear: true, //是否显示清空
        istoday: false, //是否显示今天
        issure: true, //是否显示确认
        //是否显示节日
        festival: true,
        //最小日期
        min: laydate.now(),
        //最大日期
        max: '2099-12-31 23:59:59',
        // max: laydate.now(), //设定最大日期为当前日期
        //开始日期
        start: laydate.now(),
        fixed: false, //是否固定在可视区域
        zIndex: 99999999, //css z-index
        choose: function(dates) { //选择好日期的回调
          //var  time = dates.replace(new RegExp("-","gm"),"/");

          var time = dates.split('-').join('\/');

          var time_hm = (new Date(time)).getTime(); //得到毫秒数

          me.beginTime = time_hm;

          // 开始日选好后，重置结束日的最小日期
          // end.min = dates;
          //将结束日的初始值设定为开始日
          // end.start = dates;
        }
      };


      $(arr[0]).off().on('click', function(argument) {
        laydate(start);
      });

      // var end = {
      //   elem: arr[1], //需显示日期的元素选择器
      //   event: 'click', //触发事件
      //   format: 'YYYY-MM-DD', //日期格式
      //   istime: false, //是否开启时间选择
      //   isclear: true, //是否显示清空
      //   istoday: false, //是否显示今天
      //   issure: true, //是否显示确认
      //   festival: true, //是否显示节日
      //   // min: '1900-01-01 00:00:00', //最小日期 max: '2099-12-31 23:59:59', //最大日期 
      //   //start: '2014-6-15 23:00:00',  //开始日期
      //   max: laydate.now(), //设定最大日期为当前日期
      //   fixed: false, //是否固定在可视区域
      //   zIndex: 99999999, //css z-index
      //   choose: function(dates) { //选择好日期的回调
      //     //var  time = dates.replace(new RegExp("-","gm"),"/");
      //     var time = dates.split('-').join('\/');
      //     var time_hm = (new Date(time)).getTime(); //得到毫秒数

      //     me.endTime = time_hm;
      //     //结束日选好后，重置开始日的最大日期
      //     start.max = dates;
      //   }
      // };
      // $(arr[1]).click(function() {
      //   laydate(end);
      // });
    },
    // 其他合作方式
    _reg_other: function() {
      var me = this;
      $('#other_teamwork').off().on('click', function(argument) {
        $('.info_label').hide();
        $('#other_teamwork_info').show(100);
      });
    },
    // 顶部实时广告
    _reg_top: function() {
      var me = this;
      $('#top_teamwork').off().on('click', function(argument) {
        $('.info_label').hide();
        $('#top_adv_info').show(100);
      });
      // me._reg_top_done();
    },
    _reg_top_done: function() {
      var me = this;
      var business_name = $('#business_name').val();
      var business_activity = $('#business_activity').val();

      if (!business_name) {
        layer.tips('请输入商家名称', '#business_name', {
          tips: 1
        });
        return;
      }
      if (business_name.length>10) {
        layer.tips('商家名称保持在10字以内', '#business_name', {
          tips: 1
        });
        return;
      }
      if (!business_activity) {
        layer.tips('请输入商家活动', '#business_activity', {
          tips: 1
        });
        return;
      }
      if (business_activity.length>200) {
        layer.tips('商家活动保持在200字以内', '#business_activity', {
          tips: 1
        });
        return;
      }
      var business_days = $('#business_days').val();
    },
    // 宝宝寄语
    _baby_talk: function() {
      var me = this;

      $('#to_baby_talk').off().on('click', function(argument) {
        $('.info_label').hide();
        $('#to_baby_talk_info').show(100);
      });
    },
  };
  conf.module["Main_html"] = Main_html;
})(jQuery, window);
