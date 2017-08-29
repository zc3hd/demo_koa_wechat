var path = require('path');
module.exports = {
  // 微信的配置
  wx: {
    appID: "wx3bfcdf272a04e696",
    appSecret: "b1932e8ff523a5693ea465a81322a7f9",
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
      }
    ],
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
    }
  },
  // 异步
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
  // ticket--access_token=ACCESS_TOKEN&type=jsapi
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
  // 输出
  log: {
    token: 'green',
    temp: 'cyan',
    other: 'magenta',
    news: 'blue',
    ticket:'bgBlue'
  },
};
