var Promise = require('bluebird');
var request = require('request');
var fs = require('fs-extra');
var path = require('path');

// 用于全局数据挂载
var conf = require('./config.js');
// 颜色输出设置
var colors = require('colors');
colors.setTheme(conf.log);

// 票据的数据库
var Expires_in = require('../mongo/models/Expires_in.js');



function Token() {
  var me = this;
  // token---------------------所有配置项
  this.wx = conf.wx;
  // -----------------------------sdk
  this.sdk = conf.sdk;
}
Token.prototype = {
  // --------------------------------------------------------票据
  init: function() {
    var me = this;
    // token初始化
    me.token_read(function() {
      // 到这的时候本对象上有有效票据
      me.ticket();
    });
  },
  // 本地读取
  token_read: function(cb) {
    var me = this;
    Expires_in
      .findOne({ key: 'access_token' })
      .exec(function(err, data) {
        // 有效
        if (me.token_valid(data.expires_in)) {
          // 挂载到全局
          me.token_getted(data)
          cb();
        }
        // 无效--线上获取
        else {
          me.token_online()
            .then(function(data) {
              // 挂载到全局--
              me.token_getted(data);
              cb();
            });
        }

      })
  },
  //判断有效
  token_valid: function(expires_in) {
    var me = this;
    var now = (new Date().getTime());
    // 有效
    if (now < expires_in) {
      return true;
    }
    // 无效
    else {
      console.log('* token--本地无效'.token);
      return false;
    }
  },
  // 线上获取--时间已修正
  token_online: function() {
    var me = this;
    return new Promise(function(resolve, reject) {
      request({
        url: `${me.wx.url}&appid=${me.wx.appID}&secret=${me.wx.appSecret}`
      }, function(error, response, data) {
        data = JSON.parse(data);
        var now_time = (new Date().getTime());
        var expires_in = now_time + (data.expires_in - 20) * 1000;
        data.expires_in = expires_in;
        resolve(data);
      })
    });
  },
  // 获取到了
  token_getted: function(data) {
    var me = this;
    // 从数据库那过来的数据
    if (data.key) {
      me.token_getted_local(data);
    }
    // 从线上拿过来的数据
    else {
      me.token_getted_online(data);
    }
  },
  // 本地拿到的数据
  token_getted_local: function(data) {
    var me = this;
    me.access_token = data.val;
    me.expires_in = data.expires_in;

    // 到这里绝对是有效的token
    // 全局数据挂载
    conf.wx.access_token = data.val;
    conf.wx.expires_in = data.expires_in;
  },
  // 线上拿到的数据拿到的数据
  token_getted_online: function(data) {
    var me = this;
    me.access_token = data.access_token;
    me.expires_in = data.expires_in;

    conf.wx.access_token = data.access_token;
    conf.wx.expires_in = data.expires_in;

    // 本地保存
    me.token_save();
  },
  // 本地保存
  token_save: function() {
    var me = this;
    Expires_in.update({ key: "access_token" }, {
        $set: {
          val: me.access_token,
          expires_in: me.expires_in
        }
      })
      .exec(function() {
        console.log('* token--保存成功'.token);
      });
  },
  // 全局刷新
  token_reload: function() {
    var me = this;
    return new Promise(function(resolve, reject) {
      me.token_read(function() {
        // 到这一步票据已经拿到全局
        resolve({});
      });
    });
  },

  // ---------------------------------------------------------ticket
  // 本地读取
  ticket: function(cb) {
    var me = this;
    Expires_in
      .findOne({ key: 'ticket' })
      .exec(function(err, data) {
        // 有效
        if (me.ticket_valid(data.expires_in)) {
          // 挂载到全局
          me.ticket_getted(data)
          if (cb) {
            cb();
          }
        }
        // 无效--线上获取
        else {
          me.ticket_online()
            .then(function(data) {
              // 挂载到全局--
              me.ticket_getted(data);
              if (cb) {
                cb();
              }
            });
        }

      })
  },
  //判断有效
  ticket_valid: function(expires_in) {
    var me = this;
    var now = (new Date().getTime());
    // 有效
    if (now < expires_in) {
      return true;
    }
    // 无效
    else {
      console.log('* ticket--本地无效'.ticket);
      return false;
    }
  },
  // 线上获取--时间已修正
  ticket_online: function() {
    var me = this;
    return new Promise(function(resolve, reject) {
      request({
        method: "GET",
        url: `${me.sdk.url}&access_token=${me.access_token}&type=jsapi`,
        json: true,
      }, function(error, Data) {
        var data = Data.body;
        // 时间修正
        var now_time = (new Date().getTime());
        var expires_in = now_time + (data.expires_in - 20) * 1000;
        data.expires_in = expires_in;
        resolve(data);
      })
    });
  },
  // 获取到了
  ticket_getted: function(data) {
    var me = this;
    // 从数据库那过来的数据
    if (data.key) {
      me.ticket_getted_local(data);
    }
    // 从线上拿过来的数据
    else {
      me.ticket_getted_online(data);
    }
  },
  // 本地拿到的数据
  ticket_getted_local: function(data) {
    var me = this;
    me.ticket = data.val;
    me.ticket_expires_in = data.expires_in;

    // 到这里绝对是有效的token
    // 全局数据挂载
    conf.sdk.api_ticket = data.val;
    conf.sdk.expires_in = data.expires_in;
  },
  // 线上拿到的数据拿到的数据
  ticket_getted_online: function(data) {
    var me = this;
    me.ticket = data.ticket;
    me.ticket_expires_in = data.expires_in;

    conf.sdk.api_ticket = data.ticket;
    conf.sdk.expires_in = data.expires_in;

    // 本地保存
    me.ticket_save();
  },
  // 本地保存
  ticket_save: function() {
    var me = this;
    Expires_in.update({ key: "ticket" }, {
        $set: {
          val: me.ticket,
          expires_in: me.ticket_expires_in
        }
      })
      .exec(function() {
        console.log('* ticket--保存成功'.ticket);
      });
  },
  // 全局刷新
  ticket_reload: function() {
    var me = this;
    return new Promise(function(resolve, reject) {
      me.token_read(function() {
        // 到这的时候本对象上有有效票据
        me.ticket(function() {
          // 到这一步票据已经拿到全局
          resolve({});
        });
      });

    });
  },






  // ---------------------------------------------------------永久素材
  _perm: function(key) {
    var me = this;
    // 关键字
    me.key = key;
    // 读取本地数据
    me._perm_get_loacl()
      .then(function(data) {

        // 后台信息提醒
        me._perm_info(function() {
          console.log('>> perm_other--本地读取成功'.other);
        }, function() {
          console.log('>> perm_news--本地读取成功'.news);
        });

        // 读取永久素材文件夹
        me._perm_read_dir()
          .then(function(dirs) {

            // 有新素材
            if (data.length != dirs.length) {

              // 后台信息提醒
              me._perm_info(function() {
                console.log('>> perm_other--有新素材'.other);
              }, function() {
                console.log('>> perm_news--有新素材'.news);
              });

              // 上传所有临时素材
              me._perm_add_promise(dirs)
                // 拿到所有素材ID--时间修正
                .then(function(arr) {
                  // 本地存储
                  me._perm_save_local(arr);
                });
            }
            // 素材无改变
            else {

              // 后台信息提醒
              me._perm_info(function() {
                console.log('>> perm_other--无新素材'.other);
                conf.net.permanent.data_other = data;
              }, function() {
                console.log('>> perm_news--无新素材'.news);
              });

              // if (me.key=='other') {
              //   // 全局数据挂载
              //   conf.net.permanent.data_other = data;
              // }
            }

          });
      });
  },
  // 信息提醒
  _perm_info: function(cb1, cb2) {
    var me = this;
    // 其他
    if (me.key == 'other') {
      cb1();
    }
    // news
    else {
      cb2();
    }
  },
  // 本地文件读取
  _perm_get_loacl: function() {
    var me = this;
    var p = me.key == 'other' ?
      me.perm.file_other : '';
    return fs.readJson(p);
  },
  // 文件夹下面读取--全局内容挂载
  _perm_read_dir: function(argument) {
    var me = this;
    return new Promise(function(resolve, reject) {
      var p = me.key == 'other' ?
        me.perm.path_other : '';

      fs.readdir(p, function(err, files) {
        // 全局数据挂载
        me.key == 'other' ?
          (conf.net.permanent.arr_other = files) : '';

        resolve(files);
      })
    });
  },
  // 获取上传的promise
  _perm_add_promise: function(arr) {
    var me = this;
    // 上传的promise
    var all_promise = [];
    var info = null;
    arr.forEach(function(item, index) {
      // 读取文件夹下面的数据
      info = me._perm_file_info(item);
      all_promise.push(me._perm_add_one(info));
    });
    // return dir_path;
    return Promise.all(all_promise);
  },
  // 读取文件信息
  _perm_file_info: function(item) {
    var me = this;

    if (me.key == 'other') {
      var names = null;
      var file_path = null;
      var info = null;
      // 拿到文件夹所有的文件名数据
      names = fs.readdirSync(path.join(me.perm.path_other, item));
      file_path = path.join(me.perm.path_other, item, names[0]);
      info = path.parse(file_path);

      var type = null;
      var ext = info.ext.toLowerCase();
      if ([".mp3", ".wma", ".wav", ".amr"].indexOf(ext) != -1) {
        type = 'voice';
      }
      if ([".bmp", ".png", ".jpeg", ".jpg", ".gif"].indexOf(ext) != -1) {
        type = 'image';
      }
      if (ext == '.mp4') {
        type = 'video';
      }

      // 视频
      if (type == 'video') {
        return {
          file_path: file_path,
          type: type,
          title: 'perm_video_title',
          introduction: 'perm_video_introduction'
        };
      }
      // 其他
      else {
        return {
          file_path: file_path,
          type: type
        };
      }


    }
  },
  // 上传临时素材--路径--类型
  _perm_add_one: function(info) {
    var me = this;
    var url = null;
    return new Promise(function(resolve, reject) {
      url = me.key == 'other' ?
        `${me.perm.add_other}&access_token=${me.access_token}&type=${info.type}` : '';
      var obj = {
        access_token: me.access_token,
        type: info.type,
        media: fs.createReadStream(info.file_path),
      };
      // 视频
      if (info.type == 'video') {
        obj.description = JSON.stringify({
          title: info.title,
          introduction: info.introduction,
        });
      }
      request({
        method: "POST",
        url: url,
        json: true,
        formData: obj
      }, function(error, data) {
        data.body.type = info.type;
        // 视频--自己把数据存了--用于回复用
        if (info.type == 'video') {
          data.body.Title = info.title;
          data.body.Description = info.introduction;
        }
        resolve(data.body);
      });
    });
  },
  // --------------------------------------本地保存
  // 本地保存ID--时间修正--归组
  _perm_save_local: function(arr) {
    var me = this;

    // 后台信息提醒
    me._perm_info(function() {
      console.log('>> perm_other--线上新增成功'.other);
    }, function() {
      console.log('>> perm_news--线上新增成功'.news);
    });

    var Data = [];
    arr.forEach(function(item, index) {
      // --------------有错误
      if (item.errcode) {
        me._perm_info(function() {
          console.log('>> perm_other--返回数据错误'.other);
        }, function() {
          console.log('>> perm_news--返回数据错误'.news);
        });

        Data.push({
          MsgType: 'text',
          Content: "您请求的永久素材返回错误",
        });

      }
      // --------------正常数据
      else {
        // 视频
        if (item.type == 'video') {
          Data.push({
            MsgType: item.type,
            MediaId: item.media_id,
            Title: item.Title,
            Description: item.Description,
          });
        }
        // 非视频
        else {
          Data.push({
            MsgType: item.type,
            MediaId: item.media_id
          });
        }
      }
    });

    me._perm_info(function() {
      // 全局数据挂载
      conf.net.permanent.data_other = Data;
      // 本地存储
      fs.writeJson(me.perm.file_other, Data)
        .then(() => {
          console.log('>> perm_other--本地存储成功'.other);
        });

    }, function() {

    });
  },

};
module.exports = Token;
