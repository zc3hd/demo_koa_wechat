(function($, window) {
  function Map_main(id) {
    var me = this;
    me.api = new conf.module.API().sdk;
    me.map_id = id;
    // 地图marker
    me.conf = {
      // img
      img_w: 55,
      img_h: 66,
      img_src: './img/sn.png',
      // map--样式
      style: 'amap://styles/blue',
    };
    // 初始化null
    me.pt = null;
  };
  Map_main.prototype = {
    init: function(id) {
      var me = this;
      // 禁止页面滚动
      me._scroll();
      // 操作栏
      me.banner();
      // 关注初始化
      // me.follow_init();
      common_fn.follow_init(function () {
        me.map_init();
      });
    },
    test: function() {

    },
    // ---------------------------------------操作栏
    banner: function() {
      var me = this;
      var arr = [
        // 一键定位
        {
          // 
          id1: 'loc',
          str1: '一键定位',
          w1: '70%',
          bgc1: '#000080',
          // 
          id2: 'pt',
          str2: '站点',
          w2: '15%',
          bgc2: '#4169E1',
          // 
          id3: 'line',
          str3: '路线',
          w3: '15%',
          bgc2: '#4169E1',
        },
        // 最近站点
        {
          // 
          id2: 'loc',
          str2: '定位',
          w2: '15%',
          bgc2: '#4169E1',
          // 
          id1: 'pt',
          str1: '最近站点',
          w1: '70%',
          bgc1: '#000080',
          // 
          id3: 'line',
          str3: '路线',
          w3: '15%',
          bgc3: '#4169E1',
        },
        // 规划线路
        {
          // 
          id3: 'loc',
          str3: '定位',
          w3: '15%',
          bgc3: '#4169E1',
          // 
          id2: 'pt',
          str2: '站点',
          w2: '15%',
          bgc2: '#4169E1',
          // 
          id1: 'line',
          str1: '规划路线',
          w1: '70%',
          bgc1: '#000080',
        },
      ];
      me.ban_click(arr[0]);
      me.ban_click(arr[1]);
      me.ban_click(arr[2]);
      // me.ban_click('line', 'pt', '规划换车路线', '车点');
    },
    // 点击事件
    ban_click: function(obj) {
      var me = this;
      $('#' + obj.id1).off().on('click', function() {

        $('#' + obj.id1).css({
          width: obj.w1,
          backgroundColor: obj.bgc1
        }).html(obj.str1);

        $('#' + obj.id2).css({
          width: obj.w2,
          backgroundColor: obj.bgc2
        }).html(obj.str2);

        $('#' + obj.id3).css({
          width: obj.w3,
          backgroundColor: obj.bgc3
        }).html(obj.str3);

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
      var map = me.map = new AMap.Map(me.map_id, {
        expandZoomRange: true,
        zoom: 12,
        mapStyle: me.conf.style
      });
    },
    // 地图的事件
    map_event: function() {
      var me = this;
      // 设备定位
      me._sn_loc();
    },
    // ------------------------------------------map-loc
    _sn_loc: function() {
      var me = this;
      me.map.plugin('AMap.Geolocation', function() {
        // 定位器
        me.geo = new AMap.Geolocation({
          //是否使用高精度定位，默认:true
          enableHighAccuracy: false,
          //超过10秒后停止定位，默认：无穷大
          timeout: 10000,
          // 显示按钮
          showButton: false,
          //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new AMap.Pixel(10, 20),
          // 显示marker
          showMarker: false,
          //定位成功后用圆圈表示定位精度范围，默认：true
          showCircle: false,
          //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          // 
          buttonPosition: 'RB',
          useNative: true
        });
        // 浏览器支持定位
        if (me.geo.isSupported()) {
          // 添加按钮
          me.map.addControl(me.geo);
          me._sn_loc_start();
        }
        // 不支持
        else {
          layer.msg('您的手机不支持获取定位');
        }
        AMap.event.addListener(me.geo, 'complete', function(data) {
          me._sn_loc_complete(data);
        });
        AMap.event.addListener(me.geo, 'error', function(data) {
          me._sn_loc_fail(data)
        });
      });
    },
    // 开始定位
    _sn_loc_start: function() {
      var me = this;
      me.geo.getCurrentPosition();
    },
    // 定位成功
    _sn_loc_complete: function(data) {
      var me = this;
      // cons({
      //   str: 1,
      //   data: data
      // });
      if (me.pt == null) {
        // cons(data.position);
        me.pt = new AMap.Marker({
          position: [data.position.lng, data.position.lat],
          offset: new AMap.Pixel(-me.conf.img_w / 2, -me.conf.img_h),
        });
        me._sn_label(me.pt, data);
        me.pt.setMap(me.map);
      } else {
        me.pt.setPosition(new AMap.LngLa(data.position.lng, data.position.lat));
      }
      // 最优视角
      me.map.setFitView([me.pt]);
    },
    // 定位失败
    _sn_loc_fail: function(data) {
      var me = this;
      cons({
        data: data
      });
    },
    // 
    _sn_label: function(marker, data) {
      var me = this;
      var Big = document.createElement("div");
      Big.className = "marker";
      // // 点标记中的图标
      var img = document.createElement("img");
      img.src = me.conf.img_src;
      Big.appendChild(img);
      // // 标记中的信息框
      var div = document.createElement("div");
      div.className = 'label';
      div.innerHTML = '<span class="info" id="devName">您的位置在这<br />' + '</span>' + '<div class="arrow"></div>';
      div.innerHTML = `
      <span class="info" id="devName">${data.formattedAddress}${data.addressComponent.street}${data.addressComponent.streetNumber}</span>
      <div class="arrow"></div>
      `;
      Big.appendChild(div);
      marker.setContent(Big); //更新点标记内容
    },














    // -------------------------------------------------------禁止页面滚动
    _scroll: function() {
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
    // ---------------------------------------------------------------sdk
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
  };
  conf.module["Map_main"] = Map_main;
})(jQuery, window);
