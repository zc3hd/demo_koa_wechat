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
    // 
    event: function() {
      var me = this;
      me.list();
    },
    list: function() {
      var me = this;
      $('#list').on('click', function() {
        var key = $('#list').attr('key');
        // 关闭状态--要打开
        if (key == 0) {
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
        }
        // 打开状态--要关闭
        else if (key == 1) {
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
        }
      });
    },
  };
  conf.module["Main_html"] = Main_html;
})(jQuery, window);
