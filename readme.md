* 后台能打出Obj的详细信息的时候，该属性应该就是string

* koa--yield 后面 需要的东西：You may only yield a function, promise, generator, array, or object,

```
module.exports = function() {
  【异步：就用Promise包装下】
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve({ a: 1 });
    }, 2000);
  })
  【同步：直接把对象返回就行】
  return { a: 1 };
}
----------------------------------------
var fn = require('./test/1.js');
app.use(function *() {
    var a1 = yield fn();
    console.log(a1);
});
```

* 启动服务的时候才会把access_token刷新。就像是scokt写的，每次调用的时候还是本地文件读取，读取到文件还是会判断下access_token的有效性。
* 因为我挂载到了全局，所以每次用的时候判断下有效性。同样每次用临时素材的时候也要判断下时间的有效性。

* 回复设置思路：有个本地预设回复数组，在数组内部，就拿到index，直接对应拿到回复的数据，进行拼接。不在本地预设数组内部，就进行异步数据请求。

* 素材上传：这里改变思路，不是在发现没有ID的进行网上查询和新增，而是直接就同步读取本地的数据，拿到对应类型的ID，所以需要在一开始把临时素材文件夹全部上传。
* 素材上传：对应的一个文件夹下面就是一个素材，因为一个回复就是设置一个对应的回复。

* 使用数组的寻找和拿数据，本地快速拿到数据
```
var arr1 = [1,2,3]
var vals = ['A','B','C'];
【对应的拿到arr1元素的下标，在拿到vals对应下标的元素】
```

* 面向对象属性函数中，参数是函数。如果要传入面向对象的属性函数时，要包装一个function
```
init: function(cb) {
  var me = this;
  cb();
},
fn: function() {
  var me = this;
  me.init(function(){
    me.fn2();
  });
},
```

* 上传素材：临时的图片视频等上传的就是formData：obj
* 永久素材：图文素材就是body:obj,其他还是formData：obj

-----------------------

### wechat/wx.js

* 原来的所有的验证核心都在这个文件里面，但是我后期做SDK的时候，需要后台提供接口，由于用的koa框架，所以。业务进行路由配置。
* async--es6语法还是不熟悉

---------------------------

* 后期需要调用SDK的时候。localtunnel这个包不稳定，推荐pagekite.
* [pagekite](http://www.360doc.com/content/15/0306/12/17181183_453043437.shtml)

-----------------------------

* 在每次更改完 node.js 项目后，我们都需要先将 node.js停止（快捷键: Ctrl+C），然后再通过命令再次运行，这样特别麻烦。这里我推荐使用 supervisor  工具，npm 安装命令为：npm install -g supervisor。这样我们启动 node.js 项目命令改为 supervisor app.js，更改项目后只需要保存，刷新浏览器页面就可以得到更改后的结果了。

--------------------------------

* web_dev_tools 这个官方工具在开发时移动调试老是有一些问题。
* 因为网页打开是看不见console的。所以后台写一个借口用于接收前端想打印的参数。在后台的控制台进行显示。
* 前端的话就包装下这个方法。看起来是直接打印的。

--------------------------------------------

* 地图使用是http，所以页面映射出去也是http
* 高德地图的设备定位的成功的函数不知道为啥成功的回调里面不执行代码
* 上面那个问题解决，应该是我传递数据的时候有错。
* 所以对于不知道是什么数据结构的数据直接JSON.stringfy();
* 后台测试接口，约定str接受字符串，obj接受obj的JSON化的字符串，然后再转回来
* obj接受obj的JSON化的字符串--在前端函数进行处理。

-------------------------------------------------

* 每次从微信客户端过来的信息都会有个全路径，`http://arminc.pagekite.me/?signature=1c71d7afd7df89e72c7239538cbdacf0efde2473&ti
mestamp=1504448652&nonce=1362152290&openid=olquvwBA1Kk4ZEJwTuxwiXAmO7js`，这个全路径就是当时这个信息访问的全路径，然后拼接到我们的静态资源的路径上。

---------------------------------

* 2017-9-5
* 数据库的接入
* 关注的函数的全局化,动态加载样式库，后面样式设置的代码也要异步处理

```
$("head").append("<link>");
css = $("head").children(":last");
css.attr({
  rel: "stylesheet",
  type: "text/css",
  href: "/scripts/common/follow/index.css"
});

setTimeout(function() {
  var w = $('#scan_m').width();
  var h = $('#scan_m').height();

  // 高
  if (w > h) {
    $('#scan_m>img').css({
      width: h * 0.9 + 'px',
      height: h * 0.9 + 'px',
    });
  }
  // 宽
  else {
    $('#scan_m>img').css({
      width: w * 0.9 + 'px',
      height: w * 0.9 + 'px',
    });
  }
}, 1000)
```

* 从微信PC端转发的网页是url:`http://arminc.pagekite.me/modules/admin/index.html?FromUserName=olquvwBA1Kk4ZEJwTuxwiXAmO7js`;
* 从手机端转发的网页的URL就有那个from的配置参数。这个特别注意下，这个没有办法。
* 前端数据后台打印，全部为字符串了。不然有点麻烦，约定为info

* koa-router 我用的这个版本有问题，大概是这样的问题：就是我多次挂载路由，但是在后面的路由就不起作用了。于是我只能挂载到能起作用的路由控制里。形成一个单独的API的控制器。里面有个modules文件，控制着不同的业务逻辑的方法。

* 本地SDK_html页面的url修正，因为是对象，修正完后就不会改变了。以至于其他人调用的时候，会把保存的我的信息给别人带过去。这是不行的。
* 所以，接下来就是本地、SDK、临时存入本地数据库。这样就不会对同一个对象改变他的属性了。
* 试了下call的用法，感觉和直接把内部的me = this这个对象传入是一样的，而且，最主要的是被传入的函数的指向不会变。

-----------------------------------------

* 2017-9-6
* 临时素材和本地素材的迁入到数据库
* token.js--只操作token和ticket的更新
* tool.js里操作素材

-------------------------------

* 2017-9-7
* "koa-router": "^5.2.2",这个版本有问题
* 上传文件做不了。koa这个不好弄
* https://github.com/guileen/koa-better-body

--------------------------------------------

* 2017-9-8
* 昨天做上传文件完全不好使，原因主要是：
* 我的koa版本是2.3.0，官方推荐使用await异步函数进行异步中间件的处理。目前master分支上所有的异步操作还是用的生成器函数。很多上传文件的中间键就是await异步函数。按照官方的方法根本就行。另外前端的提交图片也有问题。
* 今早上想就决定全部用koa2.0的推荐的用法把项目改一遍。说实话koa还是用得很爽的。
* branch---koa2_await
