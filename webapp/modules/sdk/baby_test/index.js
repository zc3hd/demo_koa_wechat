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
      me._swiper();
      // 广告
      me._adv({
        parent: '#advp',
        son: '#adv'
      });

      // 抽奖
      setTimeout(function(argument) {
        me._adv({
          parent: '#lottery_p',
          son: '#lottery_s'
        });
      }, 2000)

      // 导航
      me._nav();

      me._list();
    },
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
    // nav
    _nav: function() {
      var me = this;
      $('#app>.nav>div').on('click', function(e) {
        // ------------css
        var key = $(e.currentTarget).hasClass('active');
        if (key) {
          return
        }
        $('#app>.nav>div').removeClass('active');
        $(e.currentTarget).addClass('active');
        // -------------js

      })
    },
    // 数据展示
    _list: function() {
      var me = this;
      var width = $('#app>.main>.list ').width();
      //主要部分
      $("#device").gridalicious({
        // 间距
        gutter: 3,
        // 宽度
        width: (width-50)/2,
        animate: true,
        animationOptions: {
          speed: 150,
          duration: 400,
          // 预先设置完的图片加载完的回调函数
          complete: function(data) {
            console.log("dwtedx个人博客 - dwtedx.com");
          },
        },
      });
    },
  };
  conf.module["Main_html"] = Main_html;
})(jQuery, window);
