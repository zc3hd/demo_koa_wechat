'use strict';
var sha1 = require('sha1');
var Promise = require('bluebird');
var xml2js = require('xml2js');
var fs = require('fs-extra');
var path = require('path');
var request = require('request');


var conf = require('./config.js');
var colors = require('colors');
colors.setTheme(conf.log);


var Token = require('./token.js');
// 素材库
var Data = require('../mongo/models/Data.js');



// get---路径解析
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
// 对于数据库的操作增删改查
function Material() {}
Material.prototype = {
  // --------------------------------------------------临时素材
  temp: function*(key, val, expires_in) {
    var me = this;
    // 有效
    if (me.temp_valid(expires_in)) {
      return val;
    }
    // 无效
    else {
      console.log(`>> 临时素材 字段${key} 失效`.temp);
      // 全局票据刷新
      yield new Token().token_reload();
      // 素材新增
      var newData = yield me.temp_add(key, val.MsgType)
        // 时间修正
      me.temp_time(newData);
      // 本地储存数据
      yield me.temp_save(key, newData);
      // 本地读取
      var localData = yield me.temp_read(key);
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
  temp_save: function*(key, data) {
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
  temp_read: function*(key) {
    var me = this;
    return Data.findOne({ key: key }, 'val')
      .exec();
  },
  // 新增
  temp_add: function*(key, type) {
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
};
exports.Material = Material;




// --------------------------------------------------回复数据的处理
var echo_handle = async function(koa_url_come, obj, FromUserName) {
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
  // // ------------------------------sdk
  // else if (obj.category == 'sdk') {
  //   // 用户回复的信息的默认路径
  //   var url_arr = koa_url_come.split('?');
  //   // 图文列表
  //   var articles = val.Articles;

  //   articles.forEach(function(item, index) {
  //     // admin--拼接用户的ID
  //     if (conf.wx.admin_key == obj.key) {
  //       item.Url = url_arr[0] + item.Url + '?FromUserName=' + FromUserName;
  //     }
  //     // 其他sdk
  //     else {
  //       item.Url = url_arr[0] + item.Url + '?' + url_arr[1];
  //     }
  //   });
  //   return val;
  // }
  // // ------------------------------temp
  // else if (obj.category == 'temp') {
  //   return yield new Material().temp(obj.key, val, obj.expires_in);
  // }
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
