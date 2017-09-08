'use strict';
var sha1 = require('sha1');
var Promise = require('bluebird');
var xml2js = require('xml2js');
// var fs = require('fs-extra');
var fs = require('fs-extra');
var path = require('path');
var request = require('request');
var Busboy = require('busboy');
// 配置
var conf = require('./config.js');
var colors = require('colors');
colors.setTheme(conf.log);
var Token = require('./token.js');
// 素材库
var Data = require('../mongo/models/Data.js');
// 用户组
var User = require('../mongo/models/User.js');



// --------------------------------------------------路径解析
exports.parseUrl = function(url) {
  var str = url.slice(2);
  var arr = str.split("&");
  var obj = {};
  var item = null;
  arr.forEach(function(element, index) {
    item = element.split("=");
    obj[item[0]] = item[1];
  });
  return obj
};

// --------------------------------------------------数据加密
exports.sha = function(obj) {
  var str = [obj.token, obj.timestamp, obj.nonce].sort().join('');
  return sha1(str);
};

// --------------------------------------------------xml转化为对象
exports.xml2js = function(xml) {
  return new Promise(function(resolve, reject) {
    xml2js.parseString(xml, {
      trim: true
    }, function(err, result) {
      resolve(result);
    });
  });
};



// --------------------------------------------------格式化对象
function format_data(obj) {
  var msg = null;
  // 对象
  if (typeof obj == 'object' && obj.length == undefined) {
    msg = {};
    for (var k in obj) {
      msg[k] = format_data(obj[k])
    }
  }
  // 数组--一个元素就是就给出了
  else if (obj instanceof Array && obj.length == 1) {
    msg = format_data(obj[0]);
  }
  // 数组--多个元素
  else if (obj instanceof Array && obj.length == 1) {
    msg = [];
    for (var i = 0; i < obj.length; i++) {
      msg.push(format_data(obj[i]));
    }
  }
  // 元素
  else {
    msg = obj;
  }
  return msg;
};
exports.format_data = format_data;




// --------------------------------------------------素材的处理
// 对于素材的操作增删改查
function Material() {}
Material.prototype = {
  // pc （外用）-------------------------------------------全部素材
  list: async function(obj) {
    var me = this;
    console.log(obj);
    // 展示
    var limit = parseInt(obj.rows);
    // 跳过
    var skip = (obj.page - 1) * limit;

    // 查询数据
    var data = await Data
      .find()
      .limit(limit)
      .skip(skip)
      .exec();

    var count = await Data
      .count()
      .exec();

    return {
      total: count,
      rows: data
    };
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
      var newData = await me.temp_add_online(key, val.MsgType)
        // 时间修正
      me.temp_time(newData);
      // 本地储存数据
      await me.temp_save(key, newData);
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
  // 本地存储
  temp_save: async function(key, data) {
    var me = this;
    return Data.update({ key: key }, {
        $set: {
          val: JSON.stringify({
            MsgType: data.type,
            MediaId: data.media_id
          }),
          expires_in: data.created_at
        }
      })
      .exec();
  },
  // 本地读取
  temp_read: async function(key) {
    var me = this;
    return Data.findOne({ key: key }, 'val')
      .exec();
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
  // 新增到本地临时目录（外用）
  _temp_add_local: async function(req) {
    var me = this;
    // 发射器
    var _emmiter = new Busboy({ headers: req.headers });

    // 用于收集字段值
    var obj = {};
    // 传过来 fieldname--字段名  val--传过来的值
    _emmiter.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      // console.log('Field [' + fieldname + ']: value: ' + val);
      // 挂载数据
      obj[fieldname] = val;
    });

    // 要保存的地址
    var test_path = path.join(conf.temporary.path, conf.temporary.temp);

    return new Promise((resolve, reject) => {
      _emmiter.on('file', function(fieldname, file, filename, encoding, mimetype) {
        // 确认的最终保存地址
        var saveTo = path.join(path.join(test_path, filename));
        file.pipe(fs.createWriteStream(saveTo));

        // 挂载数据
        obj[fieldname] = filename;

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
      fs.mkdir(key_path)
        .then(function() {
          if (data.MsgType == 'video') {
            key_file = path.join(key_path, data.video_file);
            temp_file = path.join(temp_path, data.video_file);
          }
          return fs.move(temp_file, key_file);
        })
        .then(function() {
          resolve({
            a: "asda"
          });
        });
    });
  },












};
exports.Material = Material;


// --------------------------------------------------回复数据的处理
var echo_handle = async function(url_come, obj, FromUserName) {
  var koa_url_come = conf.wx.http + url_come;
  // 没有查询的数据
  if (obj == null) {
    var new_obj = await Data.findOne({
      key: "1"
    }).exec();
    return JSON.parse(new_obj.val);
  }
  var val = JSON.parse(obj.val);
  // ------------------------------本地预设数据
  if (obj.category == 'local') {
    return val;
  }
  // ------------------------------sdk
  else if (obj.category == 'sdk') {
    // 用户回复的信息的默认路径
    var url_arr = koa_url_come.split('?');
    // 图文列表
    var articles = val.Articles;

    articles.forEach(function(item, index) {
      // admin--拼接用户的ID
      if (conf.wx.admin_key == obj.key) {
        item.Url = url_arr[0] + item.Url + '?FromUserName=' + FromUserName;
      }
      // 其他sdk
      else {
        item.Url = url_arr[0] + item.Url + '?' + url_arr[1];
      }
    });
    return val;
  }
  // ------------------------------temp
  else if (obj.category == 'temp') {
    return await new Material().temp(obj.key, val, obj.expires_in);
  }
  // // ------------------------------perm
  // else if (obj.category == 'perm') {
  //   return val;
  // }
};
exports.data_to_echo = async function(koa_url_come, data) {
  // 预回复数据初始化
  var echo = {
    ToUserName: data.FromUserName,
    FromUserName: data.ToUserName,
    CreateTime: null,
  };

  // 来的-data.MsgType-数据类型--event--text
  var key = data.Event || data.Content;

  // 查询数据库
  // 第二个对象是要查询出来的字段
  // {
  //   val: 1,
  //   category: 1
  // }
  var obj = await Data.findOne({
    key: key
  }).exec();

  // 返回处理后的对象--me是外面访问的对象
  var val = await echo_handle(koa_url_come, obj, data.FromUserName);

  // 挂载对象
  for (var k in val) {
    echo[k] = val[k]
  }
  echo.CreateTime = new Date().getTime();

  return echo;
};


// --------------------------------------------------回复的模板
exports.tpl = function(data) {
  // 头部
  var header = `
  <xml>
  <ToUserName><![CDATA[${data.ToUserName}]]></ToUserName>
  <FromUserName><![CDATA[${data.FromUserName}]]></FromUserName>
  <CreateTime>${data.CreateTime}</CreateTime>
  <MsgType><![CDATA[${data.MsgType}]]></MsgType>
  `;
  // 身体
  var body = '';
  // 文本
  if (data.MsgType == 'text') {
    body = `<Content><![CDATA[${data.Content}]]></Content>`;
  }
  // 图片
  else if (data.MsgType == 'image') {
    body = `
    <Image>
    <MediaId><![CDATA[${data.MediaId}]]></MediaId>
    </Image>
    `;
  }
  // 语音
  else if (data.MsgType == 'voice') {
    body = `
    <Voice>
    <MediaId><![CDATA[${data.MediaId}]]></MediaId>
    </Voice>
    `;
  }
  // 视频
  else if (data.MsgType == 'video') {
    body = `
    <Video>
    <MediaId><![CDATA[${data.MediaId}]]></MediaId>
    <Title><![CDATA[${data.Title}]]></Title>
    <Description><![CDATA[${data.Description}]]></Description>
    </Video>
    `;
  }
  // 音乐
  else if (data.MsgType == 'music') {
    body = `
    <Music>
    <Title><![CDATA[${data.Title}]]></Title>
    <Description><![CDATA[${data.Description}]]></Description>
    <MusicUrl><![CDATA[${data.MusicUrl}]]></MusicUrl>
    <HQMusicUrl><![CDATA[${data.HQMusicUrl}]]></HQMusicUrl>
    <ThumbMediaId><![CDATA[${data.ThumbMediaId}]]></ThumbMediaId>
    </Music>
    `;
  }
  // 图文
  else if (data.MsgType == 'news') {
    var item = '';
    // data.Articles--图文数组
    data.Articles.forEach(function(ele) {
      item += `
     <item>
     <Title><![CDATA[${ele.Title}]]></Title> 
     <Description><![CDATA[${ele.Description}]]></Description>
     <PicUrl><![CDATA[${ele.PicUrl}]]></PicUrl>
     <Url><![CDATA[${ele.Url}]]></Url>
     </item>
     `;
    })
    body = `
    <ArticleCount>${data.Articles.length}</ArticleCount>
    <Articles>
    ${item}
    </Articles>
    `;
  }
  // 底部
  var footer = '</xml>';
  return `${header}${body}${footer}`
};


// --------------------------------------------------SDK验证
exports.signature = async function(url) {
  await new Token().ticket_reload();
  var jsapi_ticket = conf.sdk.api_ticket;
  var noncestr = Math.random().toString(36).substr(2, 15);
  var timestamp = parseInt(new Date().getTime() / 1000, 10) + '';
  var arr = [
    'jsapi_ticket=' + jsapi_ticket,
    'noncestr=' + noncestr,
    'timestamp=' + timestamp,
    'url=' + url
  ];
  var str = arr.sort().join('&');
  var signature = sha1(str);
  return {
    noncestr: noncestr,
    timestamp: timestamp,
    signature: signature,
    appId: conf.wx.appID
  }
};


// --------------------------------------------------管理员的操作
function Admin() {}
Admin.prototype = {
  // pc端的登录
  pc_login: async function(opts) {
    var me = this;
    me.opts = opts;
    var user = await User
      .findOne({ name: me.opts.name })
      .exec();

    var echo = me.login_echo(user);
    return echo;
  },
  // 登录验证
  login_echo: function(data) {
    var me = this;
    // 没有查到数据
    if (data == null) {
      return {
        ret: -1,
        info: '嘿~看来你还不知道用户名~~'
      };
    }
    // 密码错误
    else if (data.password != me.opts.password) {
      return {
        ret: -1,
        info: '吆~你还不知道密码呢~~'
      };
    }
    // 不是我登录
    else if (data.user_id != me.opts.FromUserName) {
      return {
        ret: -1,
        info: '哇~竟然知道了管理员的账户和密码，本系统知道你不是管理员~~所以禁止登录~~'
      };
    }
    // 不是我登录
    else {
      return {
        ret: 0,
        info: 'welcome admin~~'
      };
    }
  },
};
exports.Admin = Admin;
