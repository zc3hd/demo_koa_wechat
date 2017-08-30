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
