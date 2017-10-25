(function($, window) {
  function Map_main(id) {
    var me = this;
    me.api = new conf.module.API().sdk;
    // 地图
    me.id = id;
    // 地图的一些配置
    me.conf = {
      // img
      img_w: 55,
      img_h: 66,
      img_src: './img/sn.png',
      // map--样式
      style: 'amap://styles/macaron',
    };
  };
  Map_main.prototype = {
    init: function(id) {
      var me = this;
      me.no_scroll();
      me.top();
      // me.sdk_init();
      me.map_init();
    },
    // 禁止页面滚动
    no_scroll: function() {
      var overscroll = function(el) {
        el.addEventListener('touchstart', function() {
          var top = el.scrollTop,
            totalScroll = el.scrollHeight,
            currentScroll = top + el.offsetHeight;
          if (top === 0) {
            el.scrollTop = 1;
          } else if (currentScroll === totalScroll) {
            el.scrollTop = top - 1;
          }
        });
        el.addEventListener('touchmove', function(evt) {
          //if the content is actually scrollable, i.e. the content is long enough
          //that scrolling can occur
          if (el.offsetHeight < el.scrollHeight) evt._isScroller = true;
        });
      }
      overscroll(document.querySelector('#main'));
      document.body.addEventListener('touchmove', function(evt) {
        if (!evt._isScroller) {
          evt.preventDefault();
        }
      });
    },
    // ------------------------------------------top
    top: function() {
      var me = this;
      me.top_click('start', 'end', '选择起点', '终点');
      me.top_click('end', 'start', '选择终点', '起点');
    },
    top_click: function(one, two, str1, str2) {
      var me = this;
      $('#' + one).on('click', function() {
        $('#' + one).css({
          width: '85%',
          backgroundColor: '#000080'
        }).html(str1);
        $('#' + two).css({
          width: '15%',
          backgroundColor: '#4169E1'
        }).html(str2);
      });
    },
    // ------------------------------------------sdk
    // sdk初始化
    sdk_init: function() {
      var me = this;
      me.api.signature({
        url: window.location.href
      }).done(function(data) {
        me.wx_config(data);
        wx.ready(function() {
          me.record();
        });
      });
    },
    // 初始化配置
    wx_config: function(data) {
      var me = this;
      wx.config({
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        debug: false,
        // 必填，公众号的唯一标识
        appId: data.appId,
        // 必填，生成签名的时间戳
        timestamp: data.timestamp,
        // 必填，生成签名的随机串
        nonceStr: data.noncestr,
        // 必填，签名，见附录1
        signature: data.signature,
        // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        jsApiList: ['startRecord', 'stopRecord', 'onVoiceRecordEnd', 'translateVoice']
      });
    },
    // ------------------------------------------record
    // 语音交互
    record: function() {
      var me = this;
      var str = '语音搜索位置'
      $('#btn').html(str)
      var key = true;
      // 开始录音
      $('#btn').on('click', function() {
        // 录制
        if (key) {
          key = false;
          $('#btn').css({
            height: '20%',
            backgroundImage: 'url("./img/start.GIF")',
            fontSize: "2rem"
          }).addClass('bottom').html('正在录音...');
          // 开始录音
          me.record_start();
        }
        // stop
        else {
          key = true;
          $('#btn').css({
            height: '50px',
            backgroundImage: 'url("./img/end.jpg")',
            fontSize: "2.5rem"
          }).removeClass("bottom").html(str);
          me.record_stop();
        }
      });
    },
    // 开始录音
    record_start: function() {
      wx.startRecord({
        cancel: function() {
          alert('您取消了录音');
        },
      });
    },
    // 停止
    record_stop: function() {
      var me = this;
      wx.stopRecord({
        success: function(res) {
          me.record_translate(res.localId);
        }
      });
    },
    // 翻译
    record_translate: function(localId) {
      var me = this;
      wx.translateVoice({
        localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function(res) {
          cons(res);
        }
      });
    },
    // ------------------------------------------map
    map_init: function() {
      var me = this;
      me.map_Baner();
      setTimeout(function() {
        me.map_event();
      }, 500);
    },
    // 初始化地图
    map_Baner: function() {
      var me = this;
      var map = me.map = new BMap.Map(me.id, {
        enableMapClick: false
      });
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
      map.enableScrollWheelZoom();
    },
    map_event: function() {
      var me = this;
      if (navigator.geolocation) {
        cons({
          info:1
        });
        me.geo = new BMap.Geolocation();
        me.geo.getCurrentPosition(function(r) {
          if (me.geo.getStatus() == BMAP_STATUS_SUCCESS) {
            cons(r.point);
            var mk = new BMap.Marker(r.point);
            me.map.addOverlay(mk);
            me.map.panTo(r.point);
          } else {
            alert('failed' + me.geo.getStatus());
          }
        }, {
          enableHighAccuracy: true
        })
      }
    },
  };
  conf.module["Map_main"] = Map_main;
})(jQuery, window);