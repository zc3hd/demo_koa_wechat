var path = require('path');
var conf = {
  // 服务的一些配置
  app: {
    // db--数据库名称
    db: 'wechat_demo',
    // port:1234
  },
  // 微信的配置
  wx: {
    token: "arminc",
    // -------------------------------------------------------------------------------
    url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
    // access_token
    access_token: null,
    // access_token的过期时间
    expires_in: null,
    // 管理员关键字
    admin_key: ['admb',"adpc",'萌宝'],

    // 配置域名的关键字
    url_key: '.me',
    // 我的域名
    http: "https://arminc.pagekite.me"
  },
  // SDK
  sdk: {
    // 获取
    url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?',
    // access_token
    api_ticket: null,
    // access_token的过期时间
    expires_in: null,
  },
  // 临时素材
  temporary: {
    // 素材路径
    path: path.join(__dirname, './material/temporary'),
    // 上传文件的临时目录名
    temp: 'temp',
    // 新增url
    add: "https://api.weixin.qq.com/cgi-bin/media/upload?",
  },
  // 永久接口
  permanent: {
    // 内容路径
    path_other: path.join(__dirname, './material/permanent_other'),
    // 本地存在路径
    file_other: path.join(__dirname, './material/json/permanent_other.json'),
    // 其他素材access_token=ACCESS_TOKEN&type=TYPE
    add_other: 'https://api.weixin.qq.com/cgi-bin/material/add_material?',
    // 全局其他类型挂载
    data_other: null,
    // 内容数组--收到的数据
    arr_other: null,


    // ----------------------------------------------------------------
    // 新增图文-access_token=ACCESS_TOKEN
    add_news: 'https://api.weixin.qq.com/cgi-bin/material/add_news?',
    // 新增图文图片-access_token=ACCESS_TOKEN
    add_news_img: 'https://api.weixin.qq.com/cgi-bin/media/uploadimg?',
  },
  // 控制台打印
  log: {
    token: 'green',
    temp: 'cyan',
    other: 'magenta',
    news: 'blue',
    ticket: 'bgBlue',
    // 背景品红
    app: 'bgMagenta',
  },
};

// test
conf.wx.appID = "wx3bfcdf272a04e696";
conf.wx.appSecret = "b1932e8ff523a5693ea465a81322a7f9";
conf.app.port = 1234;

// online
// conf.wx.appID = "wx164f9211d1a16b9f";
// conf.wx.appSecret = "5440387335d696136244c60c2057ac98";
// conf.app.port = 80;

module.exports = conf;
