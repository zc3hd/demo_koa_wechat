(function($, window) {
  function Main_html() {
    var me = this;
    me.api = new conf.module.API();
    // me.map_id = id;

    // 地图的一些配置
    me.conf = {
      // img
      img_w: 55,
      img_h: 66,
      img_src: './img/sn.png',
      // map--样式
      style: 'amap://styles/macaron',
    };
    // 初始化null
    me.pt = null;
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
      // 菜单弹出
      me.list();
      // 个人信息
      me.my();
    },
    // 菜单
    list: function() {
      var me = this;
      $('#list').on('click', function() {
        // 先看my是否打开
        var my_key = $('#my').attr('key');
        // 已打开
        if (my_key==1) {
          me.my_off_style();
        }

        var key = $('#list').attr('key');
        // 关闭状态--要打开
        if (key == 0) {
          me.list_on_style();
        }
        // 打开状态--要关闭
        else if (key == 1) {
          me.list_off_style();
        }
      });
    },
    // 菜单项要打开的样式
    list_on_style:function(){
      var me  = this;
      $('#list').attr('key', 1);

          // 菜单nav
          $('#list').css({
            width: '30%',
            backgroundColor: '#0000CD',
            borderRight: 'none'
          });

          $('#info').css({
            width: '57%',
          });

          // 菜单详情
          $('#nav_list').css({
            left: '0',
            boxShadow: '3px 0px 10px #000'
          });
    },
    // 菜单项要关闭的样式
    list_off_style:function(){
      var me = this;
      $('#list').attr('key', 0);

          // 菜单nav
          $('#list').css({
            width: '13%',
            backgroundColor: 'rgb(28, 27, 32)',
            borderRight: '1px solid #0000CD'
          });
          $('#info').css({
            width: '74%',
          });

          // 菜单详情
          $('#nav_list').css({
            left: '-30%',
            boxShadow: '0px 0px 0px #000'
          });
    },
    // 个人信息
    my: function() {
      var me = this;
      $('#my').on('click', function() {
        // 先看list是否打开
        var list_key = $('#list').attr('key');
        // 已打开
        if (list_key==1) {
          me.list_off_style();
        }

        var key = $('#my').attr('key');
        // 关闭状态--要打开
        if (key == 0) {
          me.my_on_style();

        }
        // 打开状态--要关闭
        else if (key == 1) {
          me.my_off_style();
        }
      });
    },
    // my项要打开的样式
    my_on_style:function(){
      var me = this;
      $('#my').attr('key', 1);

          // my--按钮
          $('#my').css({
            width: '65%',
            backgroundColor: '#0000CD',
            borderLeft: 'none'
          });

          $('#info').css({
            width: '22%',
          });

          // my--详情
          $('#nav_my').css({
            bottom: '0',
            boxShadow: '3px 0px 10px #000'
          });
    },
    // my项要关闭的样式
    my_off_style:function(){
      var me =this;
      $('#my').attr('key', 0);

          // my--按钮
          $('#my').css({
            width: '13%',
            backgroundColor: 'rgb(28, 27, 32)',
            borderLeft: '1px solid #0000CD'
          });

          $('#info').css({
            width: '74%',
          });

          // 菜单详情
          $('#nav_my').css({
            bottom: '-40%',
            boxShadow: '0px 0px 0px #000'
          });
    }
  };
  conf.module["Main_html"] = Main_html;
})(jQuery, window);
