/**
 * Created by cc on 2017/8/29
 */
(function(win, $) {
  var conf = win.conf = win.conf || {
    // 挂载模块
    module: {},
  };
  // 后台测试
  win.cons = function(obj) {
    // obj.data = JSON.stringify(obj.data);
    $.ajax({
      url: "/web_console",
      dataType: "json",
      type: "POST",
      data: obj
    });
  };
  // 公共函数
  win.common_fn = {
    // ------------------关注函数的全局设置
    follow_init: function(cb) {
      var key = common_fn.getParam('from');
      // 已关注
      if (key == null) {
        // 执行相应的函数
        cb();
      }
      // 转发的，默认为未关注
      else {
        var str = `
          <div id="scan_m">
          <img src="/css/follow/wx.jpg" alt="">
          </div>
          `;
        layer.open({
          type: 1,
          title: '请长按二维进行关注后使用服务',
          area: ['90%', '60%'],
          anim: 1,
          shade: 0.6,
          closeBtn: 0,
          content: str,
          skin: 'layer_wxscan',
          success: function(layero, index) {

            var w = $('#scan_m').width();
            var h = $('#scan_m').height();

            // 高
            if (w > h) {
              $('#scan_m>img').css({
                width: h * 0.9 + 'px',
                height: h * 0.9 + 'px',
              });
            }
            // 宽
            else {
              $('#scan_m>img').css({
                width: w * 0.9 + 'px',
                height: w * 0.9 + 'px',
              });
            }

          }
        });
      }
    },
    //-------------------获取浏览器url的参数
    getParam: function(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null)
        return unescape(r[2]);
      return null;
    },
    //---------------------设置datagrid中文显示
    set_lang_zn: function(id) {
      //分页栏下方文字显示
      $('#' + id + '').datagrid('getPager').pagination({
        //页数文本框前显示的汉字
        beforePageText: '第',
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示：从第{from}条到{to}条 共{total}条记录',
        onBeforeRefresh: function(pageNumber, pageSize) {
          $(this).pagination('loading');
          $(this).pagination('loaded');
        }
      });
    },
    //-------------------时间戳转日期
    formatterDateDay: function(date, flag) { //时间戳转日期
      var me = this;
      if (!date) {;
        return false;
      } else {
        if (flag && flag == true) {
          var dt = new Date(date);
          return (dt.getFullYear() + "-" + me.checkNum(dt.getMonth() + 1) + "-" + me.checkNum(dt.getDate()));
        } else {
          var dt = new Date(date);
          return (dt.getFullYear() + "-" + me.checkNum(dt.getMonth() + 1) + "-" + me.checkNum(dt.getDate()) + " " + me.checkNum(dt.getHours()) + ":" + me.checkNum(dt.getMinutes()));
        }
      }
    },
    //日期转换后，个位数加零
    checkNum: function(num) {
      if (num < 10) {
        return "0" + num;
      }
      return num;
    },
    //-----------------坐标转换
    convertWgsToGcj02: function(x, y) {
      var x1, tempx, y1, tempy;
      x1 = x * 3686400.0;
      y1 = y * 3686400.0;
      var gpsWeek = 0;
      var gpsWeekTime = 0;
      var gpsHeight = 0;

      var point = wgtochina_lb(1, Math.floor(x1), Math.floor(y1), Math.floor(gpsHeight),
        Math.floor(gpsWeek), Math.floor(gpsWeekTime));
      if (point == null) {
        return false
      } else {
        tempx = point.x;
        tempy = point.y;
        tempx = tempx / 3686400.0;
        tempy = tempy / 3686400.0;

        point.longitude = tempx;
        point.latitude = tempy;
        return point;
      }
    },
    convertGcj02ToBd09: function(gg_lon, gg_lat) {
      var x = gg_lon,
        y = gg_lat;
      var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
      var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);

      var p = {};
      p.longitude = z * Math.cos(theta) + 0.0065;
      p.latitude = z * Math.sin(theta) + 0.006;

      return p;
    },
    wgtochina_lb: function(wg_flag, wg_lng, wg_lat, wg_heit, wg_week, wg_time) {
      var x_add;
      var y_add;
      var h_add;
      var x_l;
      var y_l;
      var casm_v;
      var t1_t2;
      var x1_x2;
      var y1_y2;
      var point = null;
      if (wg_heit > 5000) {
        return point;
      }
      x_l = wg_lng;
      x_l = x_l / 3686400.0;
      y_l = wg_lat;
      y_l = y_l / 3686400.0;
      if (x_l < 72.004) {
        return point;
      }
      if (x_l > 137.8347) {
        return point;
      }
      if (y_l < 0.8293) {
        return point;
      }
      if (y_l > 55.8271) {
        return point;
      }
      if (wg_flag == 0) {
        IniCasm(wg_time, wg_lng, wg_lat);
        point = {};
        point.latitude = wg_lng;
        point.longitude = wg_lat;
        return point;
      }
      casm_t2 = wg_time;
      t1_t2 = (casm_t2 - casm_t1) / 1000.0;
      if (t1_t2 <= 0) {
        casm_t1 = casm_t2;
        casm_f = casm_f + 1;
        casm_x1 = casm_x2;
        casm_f = casm_f + 1;
        casm_y1 = casm_y2;
        casm_f = casm_f + 1;
      } else {
        if (t1_t2 > 120) {
          if (casm_f == 3) {
            casm_f = 0;
            casm_x2 = wg_lng;
            casm_y2 = wg_lat;
            x1_x2 = casm_x2 - casm_x1;
            y1_y2 = casm_y2 - casm_y1;
            casm_v = Math.sqrt(x1_x2 * x1_x2 + y1_y2 * y1_y2) / t1_t2;
            if (casm_v > 3185) {
              return (point);
            }
          }
          casm_t1 = casm_t2;
          casm_f = casm_f + 1;
          casm_x1 = casm_x2;
          casm_f = casm_f + 1;
          casm_y1 = casm_y2;
          casm_f = casm_f + 1;
        }
      }
      x_add = Transform_yj5(x_l - 105, y_l - 35);
      y_add = Transform_yjy5(x_l - 105, y_l - 35);
      h_add = wg_heit;
      x_add = x_add + h_add * 0.001 + yj_sin2(wg_time * 0.0174532925199433) + random_yj();
      y_add = y_add + h_add * 0.001 + yj_sin2(wg_time * 0.0174532925199433) + random_yj();
      point = {};
      point.x = (x_l + Transform_jy5(y_l, x_add)) * 3686400;
      point.y = (y_l + Transform_jyj5(y_l, y_add)) * 3686400;
      return point;
    },
    //------------------获取窗口视口的大小
    getClient: function() {
      if (window.innerWidth != null) {
        return {
          width: window.innerWidth,
          height: window.innerHeight
        }
      } else if (document.compatMode == "CSS1Compat") {
        return {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight
        }
      } else {
        return {
          width: document.body.clientWidth,
          height: document.body.clientHeight
        }
      }
    },
    //------------------验证手机号码
    checkPhone: function(phone) {
      if (!(/^1[3|4|5|7|8]\d{9}$/.test(phone))) {
        layer.msg('手机号码有误，请重新填写', { icon: 0, time: 1500 });
        return false;
      }
      return true;
    },
    //------------------数字保留两位小数 
    toDecimal: function(obj) {
      if (isNaN(obj.value)) {
        obj.value = ""
      } else {
        if (obj.getAttribute("data-name") == 1) {
          if (obj.value >= 1000) {
            obj.value = "999.99"
          }
        }
        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
      }
    },
    // -----------------Cookie
    getCookie: function(c_name) { //获取cookie
      if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
          c_start = c_start + c_name.length + 1;
          c_end = document.cookie.indexOf(";", c_start);
          if (c_end == -1)
            c_end = document.cookie.length;
          return unescape(document.cookie.substring(c_start, c_end))
        }
      }
      return ""
    },
    setCookie: function(c_name, value, expiredays, path) { //设置cookie
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays);
      document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ((path == null) ? "" : ";path=" + path + ";domain=capcare.com.cn");
    },
    clearCookie: function() { //清除cookie
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
        for (var i = keys.length; i--;)
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
      }
    },
  };


})(window, jQuery);
