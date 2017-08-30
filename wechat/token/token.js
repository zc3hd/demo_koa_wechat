var Promise = require('bluebird');
var request = require('request');
var fs = require('fs-extra');
var path = require('path');

// 用于全局数据挂载
var Common = require('../config.js');

// 输出设置
var colors = require('colors');
colors.setTheme(Common.log);

function Token(conf) {
  var me = this;
  // conf--所有配置项
  // ----------------------------token
  // opts--获取token的配置
  var opts = conf.wx;
  this.appID = opts.appID;
  this.appSecret = opts.appSecret;
  this.url = opts.token_url;
  this.file = opts.token_file;

  // -----------------------------临时素材
  // 临时素材-配置
  this.temp = conf.net.temporary;

  // -----------------------------永久素材
  // 配置
  this.perm = conf.net.permanent;

  // -----------------------------api_ticket
  // 配置
  this.ticket = conf.ticket;
}
Token.prototype = {
  // --------------------------------------------------------核心
  token_init: function(cb) {
    var me = this;
    // 获取本地token
    me.fn_local_get()
      // 获取数据后
      .then(function(data) {
        console.log('* token--本地读取成功'.token);
        // 有效
        if (me.fn_is_valid(data)) {
          // 注意这里为return
          // 挂载到全局
          return Promise.resolve(data);
        }
        // 无效--线上获取
        else {
          return me.fn_online_get();
        }
      })
      // 挂载数据-保存数据
      .then(function(data) {
        // 挂载到全局
        me.access_token = data.access_token;
        me.expires_in = data.expires_in;

        // 到这里绝对是有效的token
        // 全局数据挂载
        Common.wx.access_token = data.access_token;
        Common.wx.expires_in = data.expires_in;

        me.fn_local_save(data);

        // ----------------------------------------------临时素材操作
        cb();
      });
  },
  // --------------------------------------------------------票据
  init: function() {
    var me = this;
    // token初始化
    me.token_init(function() {
      // 临时素材
      me._temp();
      // 永久其他素材
      me._perm("other");
      // _ticket
      me._ticket();
    });
  },
  // 本地获取票据
  fn_local_get: function() {
    var me = this;
    return fs.readJson(me.file);
  },
  // 本地存储票据
  fn_local_save: function(data) {
    var me = this;
    fs.writeJson(me.file, data).then(() => {
      console.log('* token--本地储存成功'.token);
    });
  },
  // 验证是否有效
  fn_is_valid: function(data) {
    var me = this;
    // 空
    if (data.expires_in == 0) {
      return false;
    }
    var access_token = data.access_token;
    var expires_in = data.expires_in;
    var now = (new Date().getTime());
    // 有效
    if (now < expires_in) {
      console.log('* token--本地有效'.token);
      return true;
    }
    // 无效
    else {
      console.log('* token--本地无效'.token);
      return false;
    }
  },
  // 线上获取token
  fn_online_get: function() {
    var me = this;
    return new Promise(function(resolve, reject) {
      request({
        url: `${me.url}&appid=${me.appID}&secret=${me.appSecret}`
      }, function(error, response, data) {
        data = JSON.parse(data);
        var now_time = (new Date().getTime());
        var expires_in = now_time + (data.expires_in - 20) * 1000;
        data.expires_in = expires_in;
        console.log('* token--线上获取成功'.token);
        resolve(data);
      })
    });
  },
  // ---------------------------------------------------------临时素材
  _temp: function() {
    var me = this;
    // 读取本地数据
    me._temp_get_loacl()
      .then(function(data) {
        console.log('temp--本地读取成功'.temp);

        // 读取本地文件夹
        me._temp_read_dir()
          .then(function(dirs) {

            // 数据改变--这样的话就需要--改变一次就上传一次
            if (dirs.length != data.arr.length) {

              console.log('temp--素材有改变'.temp);

              // 上传所有临时素材
              me._temp_add_promise(dirs)
                // 拿到所有素材ID--时间修正
                .then(function(arr) {
                  // 本地存储
                  me._temp_save_local(arr);
                });
            }
            // 素材无改变
            else {
              console.log('temp--素材无改变'.temp);

              // 有效
              if (me._temp_is_valid(data.expires_in)) {
                // 全局数据挂载
                Common.net.temporary.expires_in = data.expires_in;
                // 全局数据挂载
                Common.net.temporary.data = data.arr;
              }
              // 无效--线上获取
              else {
                me._temp_read_dir()
                  // 上传所有临时素材
                  .then(function(arr) {
                    return me._temp_add_promise(arr);
                  })
                  .then(function(arr) {
                    // 本地存储
                    me._temp_save_local(arr);
                  });
              }
            }
          });
      });
  },
  // 读取本地数据文件数据
  _temp_get_loacl: function(argument) {
    var me = this;
    return fs.readJson(me.temp.file);
  },
  // 有效性判断
  _temp_is_valid: function(expires_in) {
    var me = this;
    var now = (new Date().getTime());
    // 有效
    if (now < expires_in * 1) {
      console.log('temp----数据有效'.temp);
      return true;
    }
    // 无效
    else {
      console.log('temp----数据无效'.temp);
      return false;
    }
  },
  // ------------------------------------上传新内容
  // 读取临时文件夹下面-----对应内容
  _temp_read_dir: function(argument) {
    var me = this;
    return new Promise(function(resolve, reject) {
      fs.readdir(me.temp.path, function(err, files) {
        // 全局数据挂载
        Common.net.temporary.arr = files;
        resolve(files);
      })
    });
  },
  // 获取上传的promise
  _temp_add_promise: function(arr) {
    var me = this;
    // 上传的promise
    var all_promise = [];
    var info = null;
    arr.forEach(function(item, index) {
      // 读取文件夹下面的数据
      info = me._temp_file_info(item);
      all_promise.push(me._temp_add_one(info));
    });
    // return dir_path;
    return Promise.all(all_promise);
  },
  // 读取文件信息
  _temp_file_info: function(item) {
    var me = this;
    var name = fs.readdirSync(path.join(me.temp.path, item))[0];
    var file_path = path.join(me.temp.path, item, name);
    var info = path.parse(file_path);

    var type = null;
    var ext = info.ext.toLowerCase();
    if ([".mp3", ".amr"].indexOf(ext) != -1) {
      type = 'voice';
    }
    if ([".png", ".jpeg", ".jpg", ".gif"].indexOf(ext) != -1) {
      type = 'image';
    }
    if (ext == '.mp4') {
      type = 'video';
    }
    return {
      file_path: file_path,
      type: type
    };
  },
  // 上传临时素材--路径--类型
  _temp_add_one: function(info) {
    var me = this;
    return new Promise(function(resolve, reject) {
      request({
        method: "POST",
        url: `${me.temp.add}&access_token=${me.access_token}&type=${info.type}`,
        json: true,
        formData: {
          media: fs.createReadStream(info.file_path)
        }
      }, function(error, data) {
        resolve(data.body);
      })
    });
  },
  // --------------------------------------本地保存
  // 本地保存ID--时间修正--归组
  _temp_save_local: function(arr) {
    var me = this;
    console.log('temp--线上新增成功'.temp);
    // 时间修正
    var _item = null;

    var Data = [];

    var type = null;

    arr.forEach(function(item, index) {
      _item = item;

      // 全局挂载临时素材的有效时间 // 默认的三天后过期 
      me.temp.expires_in = (_item.created_at + 3 * 24 * 3600 - 20) * 1000;
      // 视频
      if (_item.type == 'video') {
        Data.push({
          MsgType: _item.type,
          MediaId: _item.media_id,
          Title: '视频',
          Description: '本站视频',
        });
      }
      // 非视频
      else {
        Data.push({
          MsgType: _item.type,
          MediaId: _item.media_id
        });
      }

    });
    // 全局数据挂载
    Common.net.temporary.data = Data;
    Common.net.temporary.expires_in = me.temp.expires_in;

    // 本地存储
    fs.writeJson(me.temp.file, {
        arr: Data,
        expires_in: me.temp.expires_in
      })
      .then(() => {
        console.log('temp--本地存储成功'.temp);
      });
  },

  // ---------------------------------------------------------ticket
  _ticket: function() {
    var me = this;
    // 读取本地数据
    me._ticket_get_loacl()
      .then(function(data) {
        console.log('* api_ticket--本地读取成功'.ticket);

        // 有效
        if (me._ticket_is_valid(data.expires_in)) {
          // 全局数据挂载
          Common.ticket.api_ticket = data.api_ticket;
          // 全局数据挂载
          Common.ticket.expires_in = data.expires_in;
        }
        // 无效--线上获取
        else {
          me._ticket_get_online()
            .then(function(Data) {
              me._ticket_save_local(Data);
            });
        }
      });
  },
  // 本地获取
  _ticket_get_loacl: function() {
    var me = this;
    return fs.readJson(me.ticket.file);
  },
  // 验证有效性
  _ticket_is_valid: function(expires_in) {
    var me = this;
    var now = (new Date().getTime());
    // 有效
    if (now < expires_in * 1) {
      console.log('* api_ticket----数据有效'.ticket);
      return true;
    }
    // 无效
    else {
      console.log('* api_ticket----数据无效'.ticket);
      return false;
    }
  },
  // 线上获取
  _ticket_get_online: function() {
    var me = this;
    return new Promise(function(resolve, reject) {
      request({
        method: "GET",
        url: `${me.ticket.url}&access_token=${me.access_token}&type=jsapi`,
        json: true,
      }, function(error, Data) {
        var data = Data.body;
        // 时间修正
        var now_time = (new Date().getTime());
        var expires_in = now_time + (data.expires_in - 20) * 1000;
        data.expires_in = expires_in;
        console.log('* api_ticket--线上获取成功'.ticket);
        resolve(data);
      })
    });
  },
  // 本地存储
  _ticket_save_local: function(data) {
    var me = this;

    // 全局数据挂载
    Common.ticket.api_ticket = data.ticket;
    Common.ticket.expires_in = data.expires_in;

    // 本地存储
    fs.writeJson(me.ticket.file, {
        ticket: data.ticket,
        expires_in: data.expires_in
      })
      .then(() => {
        console.log('* api_ticket--本地存储成功'.ticket);
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
                Common.net.permanent.data_other = data;
              }, function() {
                console.log('>> perm_news--无新素材'.news);
              });

              // if (me.key=='other') {
              //   // 全局数据挂载
              //   Common.net.permanent.data_other = data;
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
          (Common.net.permanent.arr_other = files) : '';

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
      Common.net.permanent.data_other = Data;
      // 本地存储
      fs.writeJson(me.perm.file_other, Data)
        .then(() => {
          console.log('>> perm_other--本地存储成功'.other);
        });

    }, function() {

    });
  },


  // ------------------------------------------------------reload
  // 票据重新加载
  token_reload: function(argument) {
    var me = this;
    return new Promise(function(resolve, reject) {
      me.token_init(function() {
        // 到这一步票据已经拿到全局
        resolve({});
      });
    });
  },
  // 临时素材重新加载
  temp_reload: function() {
    var me = this;
    return new Promise(function(resolve, reject) {
      me.token_init(function() {
        // 到这一步票据已经挂载到全局
        fs.readJson(me.temp.file)
          .then(function(data) {
            console.log('temp--本地读取成功'.temp);
            // 读取本地文件夹
            me._temp_read_dir()
              .then(function(dirs) {
                // 数据改变--这样的话就需要--改变一次就上传一次
                if (dirs.length != data.arr.length) {

                  console.log('temp--素材有改变'.temp);

                  // 上传所有临时素材
                  me._temp_add_promise(dirs)
                    // 拿到所有素材ID--时间修正
                    .then(function(arr) {
                      // 本地存储
                      me._temp_save_local(arr);
                      // 到这部的时候--临时素材的ID和有效时间已经挂载到全局
                      resolve({});
                    });
                }
                // 素材无改变
                else {
                  console.log('temp--素材无改变'.temp);
                  // 测试
                  // data.expires_in = 1500000000000;
                  // 有效
                  if (me._temp_is_valid(data.expires_in)) {
                    // 全局数据挂载
                    Common.net.temporary.expires_in = data.expires_in;
                    // 全局数据挂载
                    Common.net.temporary.data = data.arr;
                  }
                  // 无效--线上获取
                  else {

                    // 上传所有临时素材
                    me._temp_read_dir()
                      .then(function(arr) {
                        return me._temp_add_promise(arr);
                      })
                      .then(function(arr) {
                        // 本地存储
                        me._temp_save_local(arr);
                        // 到这部的时候--临时素材的ID和有效时间已经挂载到全局
                        resolve({});
                      });
                  }
                };
              });
          });
      })
    });
  },
  // api票据重新加载
  api_ticket_reload: function() {
    var me = this;
    return new Promise(function(resolve, reject) {
      me.token_init(function() {

        // 到这一步票据已经挂载到全局
        fs.readJson(me.ticket.file)
          .then(function(data) {
            console.log('ticket--本地读取成功'.ticket);

            return;
            // 读取本地文件夹
            me._temp_read_dir()
              .then(function(dirs) {
                // 数据改变--这样的话就需要--改变一次就上传一次
                if (dirs.length != data.arr.length) {

                  console.log('temp--素材有改变'.temp);

                  // 上传所有临时素材
                  me._temp_add_promise(dirs)
                    // 拿到所有素材ID--时间修正
                    .then(function(arr) {
                      // 本地存储
                      me._temp_save_local(arr);
                      // 到这部的时候--临时素材的ID和有效时间已经挂载到全局
                      resolve({});
                    });
                }
                // 素材无改变
                else {
                  console.log('temp--素材无改变'.temp);
                  // 测试
                  // data.expires_in = 1500000000000;
                  // 有效
                  if (me._temp_is_valid(data.expires_in)) {
                    // 全局数据挂载
                    Common.net.temporary.expires_in = data.expires_in;
                    // 全局数据挂载
                    Common.net.temporary.data = data.arr;
                  }
                  // 无效--线上获取
                  else {

                    // 上传所有临时素材
                    me._temp_read_dir()
                      .then(function(arr) {
                        return me._temp_add_promise(arr);
                      })
                      .then(function(arr) {
                        // 本地存储
                        me._temp_save_local(arr);
                        // 到这部的时候--临时素材的ID和有效时间已经挂载到全局
                        resolve({});
                      });
                  }
                };
              });
          });
      })
    });
  },





};
module.exports = Token;
