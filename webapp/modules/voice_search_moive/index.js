(function($, window) {
  function Main() {
    var me = this;
    me.init_key = '钢铁侠';
    me.api = new conf.module.API();
  };
  Main.prototype = {
    init: function() {
      var me = this;
      me.no_scroll();
      common_fn.follow_init(function() {
        me.sdk_init();
        me.db_movie(me.init_key);
      });
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
          if (el.offsetHeight < el.scrollHeight)
            evt._isScroller = true;
        });
      }
      overscroll(document.querySelector('#main'));
      document.body.addEventListener('touchmove', function(evt) {
        if (!evt._isScroller) {
          evt.preventDefault();
        }
      });
    },
    // sdk初始化
    sdk_init: function() {
      var me = this;
      me.api.sdk.signature({
          url: window.location.href
        })
        .done(function(data) {
          me.wx_config(data);
          me.wx_ready(function() {
            me.record();
          })
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
        jsApiList: [
          'startRecord',
          'stopRecord',
          'onVoiceRecordEnd',
          'translateVoice'
        ]
      });
    },
    wx_ready: function(cb) {
      cb();
    },
    // 语音交互
    record: function() {
      var me = this;
      var str = '语音搜索电影'
      $('#btn').html(str)
      var key = true;
      // 开始录音
      $('#btn').on('click', function() {
        // 录制
        if (key) {
          key = false;
          $('#btn')
            .css({
              height: '20%',
              backgroundImage: 'url("./img/start.GIF")',
              fontSize: "2rem"
            })
            .addClass('bottom')
            .html('正在录音...');
          // 开始录音
          me.record_start();
        }
        // stop
        else {
          key = true;
          $('#btn')
            .css({
              height: '10%',
              backgroundImage: 'url("./img/end.jpg")',
              fontSize: "2.5rem"
            })
            .removeClass("bottom")
            .html(str);

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
          me.db_movie(res.translateResult);
        }
      });
    },
    // 电影请求数据
    db_movie: function(str) {
      var me = this;
      me.api.movie.search(str)
        .done(function(data) {
          me.db_movie_render(data.subjects);
        })
    },
    db_movie_render: function(arr) {
      var me = this;
      var str = '';
      $('#main').html(str);
      var director = null;
      arr.forEach(function(item, index) {
        if (item.directors.toString() == "") {
          director = '未找到(张宏昌先顶下)';
        }
        // 有导演
        else {
          director = item.directors[0].name;
        }
        str += `
          <div id="item">
            <div class="left" class="middle">
              <img src="${item.images.large}" alt="">
            </div>
            <div class="right">
              <div class="title middle">${item.title}</div>
              <div class="middle">原名：${item.original_title}</div>
              <div class="middle">导演：${director}</div>
              <div class="middle">年份：${item.year}</div>
              <div class="middle">观次：${item.collect_count}</div>
              <div class="middle">评分：${item.rating.average}</div>
              <div class="alt middle">详情：<a href="${item.alt}">豆瓣</a></div>
              <div class="middle">类型：${item.genres.join(' ')}</div>
            </div>
          </div>
          `;
      });
      $('#main').html(str);
    },
  };
  conf.module["Main"] = Main; // 登录
})(jQuery, window);
