'use strict';
var sha1 = require('sha1');
var Promise = require('bluebird');
var xml2js = require('xml2js');
var Core = require('./core/index.js');
var Core_async = require('./core_async/index.js');
var conf = require('./config.js');


// --------------------------------------------------数据加密
exports.sha = function(obj) {
  var str = [obj.token, obj.timestamp, obj.nonce].sort().join('');
  return sha1(str);
}

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
}
exports.format_data = format_data;



// --------------------------------------------------回复数据的设置
exports.data_to_echo = function*(data) {
  // 预回复数据初始化
  var echo = {
    ToUserName: data.FromUserName,
    FromUserName: data.ToUserName,
    CreateTime: null,
  };

  // 本地预设数据
  var _local = require('./config.js').wx.local;
  // 本地sdk预设数据
  var _sdk_arr = require('./config.js').wx.sdk_arr;
  // 永久素材-other
  var _other = require('./config.js').net.permanent.arr_other;


  // 来的-data.MsgType-数据类型--event--text
  var cinfo = data.Event || data.Content;


  // 本地数据存在--同步读取寻找预设数据
  if (_local.indexOf(cinfo) != -1) {
    new Core().init(_local.indexOf(cinfo), echo, 'local');
  }
  else if(_sdk_arr.indexOf(cinfo) != -1){
    new Core().init(_sdk_arr.indexOf(cinfo), echo, 'sdk');
  }
  // 永久-other
  else if (_other.indexOf(cinfo) != -1) {
    new Core().init(_other.indexOf(cinfo), echo, 'other');
  }
  // 临时--需要在异步中找
  else {
    echo = yield new Core_async().init(cinfo, echo);
  }
  return echo;
};

// --------------------------------------------------sdk素材页面的URL修正
exports.sdk_url = function(obj, info, echo) {
  var sdk_arr = conf.wx.sdk_arr;
  var url_arr = obj.href.split('?');
  var articles = echo.Articles;
  
  // 属于sdk数组
  if (sdk_arr.indexOf(info) != -1) {
    articles.forEach(function(item, index) {
      // 已经拼接完成
      if (item.Url.indexOf(conf.wx.url_key) != -1) {}
      // 未拼接完成
      else {
        item.Url = url_arr[0] + item.Url + '?' + url_arr[1];
      }
    });
  }
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
