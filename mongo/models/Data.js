var mongoose = require('mongoose');

//schema
var _Schema = new mongoose.Schema({
  "key": String,
  "val": String,
  "category": String,
  "expires_in": Number,
});

//model
// 所有的素材存放在这
var Data = mongoose.model("data", _Schema);


var arr = [
  // -----------------------------local--本地设置
  // subscribe
  {
    key: 'subscribe',
    val: {
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
    category: 'local',
    expires_in: 0
  },
  // 1
  {
    key: '1',
    val: {
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
    category: 'local',
    expires_in: 0
  },
  // 2
  {
    key: '2',
    val: {
      MsgType: 'text',
      Content: '你输入的是2'
    },
    category: 'local',
    expires_in: 0
  },
  // ----------------------------temporary--临时文件
  // 3
  {
    key: '3',
    val: {
      MsgType: "voice",
      MediaId: '5jcoMgbiaN009KlhUH3i4_hkaXAqe0b62ZQiHLDYCXbFdh-dX96Sea1F10CC7ZHb'
    },
    category: 'temp',
    expires_in: 1504707748000
  },
  // 4
  {
    key: '4',
    val: {
      MsgType: "image",
      MediaId: 'etB0pX38H-sh-ZxUXqiSzGIWoEfRMzLf3rEqGKKuTUmxJ7Q_8rTeKw-b5_QiLdir'
    },
    category: 'temp',
    expires_in: 1504707748000
  },
  // 5
  {
    key: '5',
    val: {
      MsgType: "video",
      MediaId: 'pYTOxTZfmA8s98PivVyorBh8cahorDqCDq_K8ybECmg5KX-wOpUkL0JtM3PD39kq',
      Title: '视频',
      Description: '本站视频'
    },
    category: 'temp',
    expires_in: 1504707748000
  },
  // ----------------------------permanent--永久文件
  // 6
  {
    key: '6',
    val: {
      MsgType: "image",
      MediaId: 'kbaSi-VHFBZhP0pbyg7AM_PesDw6X7uLnOX6ykCJz5o',
    },
    category: 'perm',
    expires_in: 0
  },
  {
    key: '7',
    val: {
      MsgType: "voice",
      MediaId: 'kbaSi-VHFBZhP0pbyg7AM0Uvho6n22wR7Dhwg7j8Y2c',
    },
    category: 'perm',
    expires_in: 0
  },
  // ----------------------------sdk---自定义网页
  // admin
  {
    key: 'admin',
    val: {
      // 回复--图文
      MsgType: 'news',
      Articles: [{
        Title: 'welcome admin',
        Description: 'this is my place',
        PicUrl: 'http://www.chhua.com/wp-content/uploads/auto_save_image/2013/08/0302124RG.jpg',
        Url: "modules/admin_manage/index.html"
      }]
    },
    category: 'sdk',
    expires_in: 0
  },
  // mov
  {
    key: 'mov',
    val: {
      // 回复--图文
      MsgType: 'news',
      Articles: [{
        Title: 'mov',
        Description: 'mov',
        PicUrl: 'http://www.yongjiasoft.com/attached/image/20170224/20170224090628_1285.jpg',
        Url: "modules/voice_search_moive/index.html"
      }]
    },
    category: 'sdk',
    expires_in: 0
  },
  // gd
  {
    key: 'gd',
    val: {
      // 回复--图文
      MsgType: 'news',
      Articles: [{
        Title: '语音定位导航(gaode)',
        Description: 'location',
        PicUrl: 'http://i5.hexunimg.cn/2015-09-30/179576515.jpg',
        Url: "modules/voice_loc_Gaode/index.html"
      }]
    },
    category: 'sdk',
    expires_in: 0
  },
  // bd
  {
    key: 'bd',
    val: {
      // 回复--图文
      MsgType: 'news',
      Articles: [{
        Title: '语音定位导航(baidu)',
        Description: 'location',
        PicUrl: 'http://i5.hexunimg.cn/2015-09-30/179576515.jpg',
        Url: "modules/voice_loc_baidu/index.html"
      }]
    },
    category: 'sdk',
    expires_in: 0
  },
  // bike
  {
    key: 'bike',
    val: {
      // 回复--图文
      MsgType: 'news',
      Articles: [{
        Title: '北京公共自行车站点导航',
        Description: '【一键定位|最近站点|规划路线】',
        PicUrl: 'http://i5.hexunimg.cn/2015-09-30/179576515.jpg',
        Url: "modules/loc_find_bikeHome/index.html"
      }]
    },
    category: 'sdk',
    expires_in: 0
  },


]

// 超级管理员
// User.create({
//   "name": 'cc',
//   "password": 'e10adc3949ba59abbe56e057f20f883e',
//   "user_id": 'olquvwBA1Kk4ZEJwTuxwiXAmO7js'
// })
// .then(function (data) {
// 	console.log(data);
// });


module.exports = Data;

// User.findOne({"name":"admin"}, function(err, docs) {
// 	console.log(docs);
// 	docs.powers = [0,1,2,4];
// 	docs.save();
// });

// UserSchema.methods.test = function () {
// 	console.log('asd');
// };

// var asd = new User({
// 	"name": 'String',
//   "password": 111234,
//   "course": [0],
//   "powers": [2,3]
// });

// asd.test();
