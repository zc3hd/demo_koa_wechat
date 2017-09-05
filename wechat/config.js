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
    token_url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
    // 本地存储
    token_file: path.join(__dirname, './token/token.json'),
    // access_token
    access_token: null,
    // access_token的过期时间
    expires_in: null,
    // ----------------------------------------------
    // 本地预设的收到的数据
    local: ['subscribe', '1', '2'],
    // 对应的回复数据
    echo: [
      // "subscribe"
      {
        MsgType: 'news',
        Articles: [{
          Title: 'cc',
          Description: 'cc~s blog',
          PicUrl: 'http://img3.redocn.com/tupian/20150430/mantenghuawenmodianshiliangbeijing_3924704.jpg',
          Url: "https://zc3hd.github.io/"
        }, {
          Title: 'c2',
          Description: 'cc~s blog',
          PicUrl: 'http://img3.redocn.com/tupian/20150430/mantenghuawenmodianshiliangbeijing_3924704.jpg',
          Url: "https://zc3hd.github.io/"
        }]
      },
      // 1
      {
        // 回复--图文
        MsgType: 'news',
        Articles: [{
          Title: 'cc',
          Description: 'cc~s blog',
          PicUrl: 'http://img3.redocn.com/tupian/20150430/mantenghuawenmodianshiliangbeijing_3924704.jpg',
          Url: "https://zc3hd.github.io/"
        }, {
          Title: 'c2',
          Description: 'cc~s blog',
          PicUrl: 'http://img3.redocn.com/tupian/20150430/mantenghuawenmodianshiliangbeijing_3924704.jpg',
          Url: "https://zc3hd.github.io/"
        }]
      },
      // 2
      {
        MsgType: 'text',
        Content: '你输入的是2'
      },
    ],
    // ----------------------------------------------
    // 管理员关键字
    admin_key:'admin',
    // 需要调用sdk页面的关键字
    sdk_arr: ['admin', 'mov', 'gd', 'bd', 'bike', ],
    // 对应回复的数据
    sdk_echo: [
      // admin
      {
        // 回复--图文
        MsgType: 'news',
        Articles: [{
          Title: 'welcome admin',
          Description: 'this is my place',
          PicUrl: 'http://www.chhua.com/wp-content/uploads/auto_save_image/2013/08/0302124RG.jpg',
          Url: "modules/admin_manage/index.html"
        }]
      },
      // mov
      {
        // 回复--图文
        MsgType: 'news',
        Articles: [{
          Title: 'mov',
          Description: 'mov',
          PicUrl: 'http://www.yongjiasoft.com/attached/image/20170224/20170224090628_1285.jpg',
          Url: "modules/voice_search_moive/index.html"
        }]
      },
      // gd
      {
        // 回复--图文
        MsgType: 'news',
        Articles: [{
          Title: '语音定位导航(gaode)',
          Description: 'location',
          PicUrl: 'http://i5.hexunimg.cn/2015-09-30/179576515.jpg',
          Url: "modules/voice_loc_Gaode/index.html"
        }]
      },
      // bd
      {
        // 回复--图文
        MsgType: 'news',
        Articles: [{
          Title: '语音定位导航(baidu)',
          Description: 'location',
          PicUrl: 'http://i5.hexunimg.cn/2015-09-30/179576515.jpg',
          Url: "modules/voice_loc_baidu/index.html"
        }]
      },
      // bike
      {
        // 回复--图文
        MsgType: 'news',
        Articles: [{
          Title: '北京公共自行车站点导航',
          Description: '【一键定位|最近站点|规划路线】',
          PicUrl: 'http://i5.hexunimg.cn/2015-09-30/179576515.jpg',
          Url: "modules/loc_find_bikeHome/index.html"
        }]
      },
    ],
    // 配置域名的关键字
    url_key: '.me',
    // 默认回复的数据
    echo_default: {
      MsgType: 'news',
      Articles: [{
        Title: '默认数据',
        Description: 'cc~s blog',
        PicUrl: 'http://img3.redocn.com/tupian/20150430/mantenghuawenmodianshiliangbeijing_3924704.jpg',
        Url: "https://zc3hd.github.io/"
      }, {
        Title: 'c2',
        Description: 'cc~s blog',
        PicUrl: 'http://img3.redocn.com/tupian/20150430/mantenghuawenmodianshiliangbeijing_3924704.jpg',
        Url: "https://zc3hd.github.io/"
      }]
    },
  },
  // 素材类
  net: {
    // 临时
    temporary: {
      // 素材路径
      path: path.join(__dirname, './material/temporary'),
      // 本地存在路径
      file: path.join(__dirname, './material/json/temporary.json'),
      // 新增url
      add: "https://api.weixin.qq.com/cgi-bin/media/upload?",
      // ----------------------------------------------------------------
      // 全局本地数据的挂载--回复的数据
      data: null,
      // 内容数组--收到的数据
      arr: null,
      // 过期时间
      expires_in: null
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
    }
  },
  // SDK--ticket
  ticket: {
    // 获取
    url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?',
    // 本地存储
    file: path.join(__dirname, './sdk/api_ticket.json'),
    // access_token
    api_ticket: null,
    // access_token的过期时间
    expires_in: null,
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
