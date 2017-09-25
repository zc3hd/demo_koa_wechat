'use strict';
var sha1 = require('sha1');
var Promise = require('bluebird');
var xml2js = require('xml2js');
var fs = require('fs-extra');
var path = require('path');
var request = require('request');
var Busboy = require('busboy');
// 配置
// var conf = require('./config.js');
// var colors = require('colors');
// colors.setTheme(conf.log);


var conf = {
  path: path.join(__dirname, '../webapp/modules/sdk/baby_test/img/bady'),
  vote:36,
}

// ---------------------------数据库
// 微信用户
var WxUser = require('../mongo/models/WxUser.js');
// baby
var Baby = require('../mongo/project_models/Baby.js');
// 统计
var Count = require('../mongo/project_models/Count.js');



function Baby_main() {}
Baby_main.prototype = {
  // ----------------------------------------统计
  _count: async function(key) {
    var me = this;

    // 查询
    var obj = await Count.findOne({
      key: key
    }).exec();



    await Count.update({
        key: key
      }, {
        $set: {
          val: (obj.val + 1)
        }
      })
      .exec();
  },
  // 查询所有的统计数据
  _all: async function() {
    var me = this;
    return await Count.find({})
      .exec();
  },
  // ----------------------------------------添加微信用户
  // 添加微信用户
  add_wx_one: async function(obj) {
    var me = this;
    // 要回复的数据
    var echo = null;

    // 查找用户
    var data = await me.find_wx_one(obj.val);
    // 没有此用户
    if (data == null) {
      echo = await WxUser.create({
        val: obj.val,
        baby: obj.baby
      }).then();
    }
    // 这个用户存在
    else {
      echo = data;
    }
    // 回复
    return echo;
  },
  // 查找微信用户
  find_wx_one: async function(val) {
    var me = this;
    return WxUser.findOne({
      val: val
    }).exec();
  },
  // ----------------------------------------报名
  // 上传到本地文件
  _upload_to_server: async function(req) {
    var me = this;
    // 发射器
    var _emmiter = new Busboy({
      headers: req.headers
    });
    // 用于收集字段值
    var obj = {};
    // 传过来 fieldname--字段名  val--传过来的值
    _emmiter.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      // console.log('Field [' + fieldname + ']: value: ' + val);
      // 挂载数据
      obj[fieldname] = val;
    });
    // 要保存的地址
    var test_path = conf.path;
    return new Promise((resolve, reject) => {

      _emmiter.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var arr = filename.split('.');
        // 随机数1
        var random = Math.floor(Math.random() * 100000);
        // 随机数2
        var timestamp = new Date().getTime();

        var file_name = `${arr[0]}_${random}_${timestamp}.${arr[1]}`;
        // 确认的最终保存地址
        var saveTo = path.join(test_path, file_name);
        file.pipe(fs.createWriteStream(saveTo));
        // 挂载数据
        obj[fieldname] = file_name;
        // console.log('File [' + fieldname + ']: filename: ' + filename);
        // file.on('data', function(data) {
        //   // console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        // });
        // file.on('end', function() {
        // })
      });
      _emmiter.on('finish', function() {
        // 全部完毕后--传递数据
        resolve(obj);
      });
      _emmiter.on('error', function(err) {
        reject(err)
      });
      req.pipe(_emmiter);
    });
  },
  // 保存到数据库
  _save: async function(obj) {
    var me = this;
    var count = await Baby.count().exec();
    obj.baby_id = count + 1;
    // 要回复的数据
    var echo = null;
    echo = await Baby.create(obj).then();
    return echo;
  },
  // -----------------------------------------数据列表
  _list: async function(obj) {
    var me = this;
    // 展示的
    var limit = parseInt(obj.rows);
    // 跳过
    var skip = (obj.page - 1) * limit;
    // 查询数据
    var data = await Baby.find()
      .sort({
        _id: 1
      })
      .limit(limit)
      .skip(skip)
      .exec();
    var count = await Baby.count().exec();
    return {
      total: count,
      rows: data
    };
  },
  // -----------------------------------------投票
  _vote: async function(obj) {
    var me = this;
    // var baby_id = obj.baby_id;

    var wx_data = await WxUser.findOne({
      val: obj.wx_user_id
    }).exec();



    // 微信用户投票等于10
    if (wx_data.baby_vote >= 10) {
      // 用户投票超上限
      return {
        ret: -1
      }
    }

    // 微信用户投票统计
    await WxUser.update({
        val: obj.wx_user_id
      }, {
        $set: {
          baby_vote: (wx_data.baby_vote + 1)
        }
      })
      .exec();



    // baby数据统计
    var baby_data = await Baby.findOne({
      baby_id: obj.baby_id
    }).exec();

    await Baby.update({
        baby_id: obj.baby_id
      }, {
        $set: {
          vote: (baby_data.vote + 1)
        }
      })
      .exec();

    // 总投票统计
    await me._count("vote");
    var vote_data = await Count.findOne({
      key: "vote"
    }).exec();

    if (vote_data.val == conf.vote) {
      // 获得大奖
      return {
        ret: conf.vote
      }
    }

    // 用户正常投票
    return {
      ret: 0
    }
  },



















  // --------------------------------------------------临时素材
  temp: async function(key, val, expires_in) {
    var me = this;
    // 有效
    if (me.temp_valid(expires_in)) {
      return val;
    }
    // 无效
    else {
      console.log(`>> 临时素材 字段${key} 失效`.temp);
      // 全局票据刷新
      await new Token().token_reload();
      // 素材新增
      var newData = await me.temp_add_online(key, val.MsgType);
      // 时间修正
      me.temp_time(newData);
      // 本地储存数据
      await me.temp_upd(key, newData);
      // 本地读取
      var localData = await me.temp_read(key);
      //  返回
      return JSON.parse(localData.val);
    }
  },
  // 有效性判断
  temp_valid: function(expires_in) {
    var me = this;
    var now = (new Date().getTime());
    // 有效
    if (now < expires_in * 1) {
      return true;
    }
    // 无效
    else {
      return false;
    }
  },
  // 时间修正
  temp_time: function(data) {
    var me = this;
    data.created_at = (data.created_at + 3 * 24 * 3600 - 20) * 1000;
  },
  // 本地数据库修正
  temp_upd: async function(key, data) {
    var me = this;
    return Data.update({
      key: key
    }, {
      $set: {
        val: JSON.stringify({
          MsgType: data.type,
          MediaId: data.media_id
        }),
        expires_in: data.created_at
      }
    }).exec();
  },
  // 本地读取
  temp_read: async function(key) {
    var me = this;
    return Data.findOne({
      key: key
    }, 'val').exec();
  },
  // 本地数据库保存
  temp_save: async function(data, newData) {
    var me = this;
    return Data.create({
      key: data.key,
      val: JSON.stringify({
        MsgType: data.MsgType,
        MediaId: newData.media_id
      }),
      category: data.category,
      expires_in: newData.created_at
    }).then();
  },
  // 线上新增
  temp_add_online: async function(key, type) {
    var me = this;
    var name = fs.readdirSync(path.join(conf.temporary.path, key))[0];
    var file_path = path.join(conf.temporary.path, key, name);
    return new Promise(function(resolve, reject) {
      request({
        method: "POST",
        url: `${conf.temporary.add}&access_token=${conf.wx.access_token}&type=${type}`,
        json: true,
        formData: {
          media: fs.createReadStream(file_path)
        }
      }, function(error, data) {
        resolve(data.body);
      })
    });
  },

  // 移动到新增目录
  _temp_key: async function(data) {
    var me = this;
    return new Promise((resolve, reject) => {
      // 目标目录
      var key_path = path.join(conf.temporary.path, data.key);
      // 临时目录
      var temp_path = path.join(conf.temporary.path, conf.temporary.temp);
      // 目标路径
      var key_file = null;
      // 临时路径
      var temp_file = null;
      // 生成目录
      fs.mkdir(key_path).then(function() {
        // 上传的视频
        if (data.MsgType == 'video') {
          key_file = path.join(key_path, data.video_file);
          temp_file = path.join(temp_path, data.video_file);
        }
        // 上传的音频
        else if (data.MsgType == 'voice') {
          key_file = path.join(key_path, data.voice_file);
          temp_file = path.join(temp_path, data.voice_file);
        }
        // 上传的图片
        else if (data.MsgType == 'image') {
          key_file = path.join(key_path, data.image_file);
          temp_file = path.join(temp_path, data.image_file);
        }
        return fs.move(temp_file, key_file);
      }).then(function() {
        resolve();
      });
    });
  },
  // 线上和本地数据库新增
  _temp_online_save: async function(data) {
    var me = this;
    // var obj = {
    //   key: '6',
    //   category: 'temp',
    //   MsgType: 'voice',
    //   voice_file: 'index.mp3'
    // };
    // 全局票据刷新
    await new Token().token_reload();
    // 素材新增
    var newData = await me.temp_add_online(data.key, data.MsgType);
    // 时间修正
    me.temp_time(newData);
    // 本地保存
    await me.temp_save(data, newData);
    console.log(`>> 临时素材 字段${data.key} 本地保存成功`.temp);
  },
  // --------------------------------------------------文本和news
  _local_sdk_save: function(data) {
    var me = this;
    var val = null;
    // 文本
    if (data.MsgType == 'text') {
      val = JSON.stringify({
        MsgType: data.MsgType,
        Content: data.Content
      });
    }
    // 图文
    else {
      val = JSON.stringify({
        MsgType: data.MsgType,
        Articles: [{
          Title: data.Title,
          Description: data.Description,
          PicUrl: data.PicUrl,
          Url: data.Url
        }]
      });
    }
    return Data.create({
      key: data.key,
      val: val,
      category: data.category,
    }).then();
  },
  // --------------------------------------------------删除
  _del: function(data) {
    var me = this;
    // 删除的类型 text news
    if ((data.MsgType == 'text') || (data.MsgType == 'news')) {
      return Data.remove({
        key: data.key,
      }).then();
    }
    // 删除临时文件
    else {
      return fs.remove(path.join(conf.temporary.path, data.key))
        .then(function() {
          return Data.remove({
            key: data.key,
          })
        })
        .then();
    }

  },
  // --------------------------------------------------更新
  _upd_news: function(data) {
    var me = this;
    return Data.update({
        _id: data._id
      }, {
        $set: {
          key: data.key,
          val: JSON.stringify({
            MsgType: data.MsgType,
            Articles: [{
              Title: data.Title,
              Description: data.Description,
              PicUrl: data.PicUrl,
              Url: data.Url
            }]
          })
        }
      })
      .exec();
  },
};
module.exports = Baby_main;
