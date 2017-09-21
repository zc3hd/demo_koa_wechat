(function($, window) {
  function Main_html() {
    var me = this;
    me.api = new conf.module.API();

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


      var layer_load = layer.load(0, { shade: 0.5 });
      // 导航
      me._nav();
      // 加载
      me._nav_load('reg', layer_load);

    },
    // -----------------------------------forever
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

        // 所有的子项
        $('#app>div').show();

        // ------商家合作
        if (attr_key == 'reg') {
          // 所有的子项
          $('#app>div').hide();

          // 顶部实时广告
          $('#app>#top_info').show();

          // 导航栏
          $('#app>#nav').show();

          // 轮播图
          $('#app>#swiper').show();

          // main 单独显示
          $('#app>#main').show();
        }



        // -------------js
        var layer_load = layer.load(0, { shade: 0.5 });
        me._nav_load(attr_key, layer_load);
      })
    },
    // 菜单加载
    _nav_load: function(key, layer_load) {
      var me = this;
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
    // -----------------------------------主页展示
    // 数据展示
    _main: function(layer_load) {
      var me = this;
      // 展示列表
      me._mian_list(layer_load);
    },
    // 展示列表
    _mian_list: function(layer_load) {
      var me = this;
      var width = $('#app>.main>.list ').width();
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
