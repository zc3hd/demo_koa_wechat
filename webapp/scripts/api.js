(function($, window) {
  function API() {
    var me = this;
  };
  API.prototype = {
    // -----------------验证
    signature: function(obj) {
      return $.ajax({
        url: "/sdk_init/signature",
        dataType: "json",
        type: "POST",
        data: obj
      })
    },
    // douban
    movie: function(str) {
      return $.ajax({
        url: "https://api.douban.com/v2/movie/search?q=" + str,
        dataType: "jsonp",
        jsonp:'callback',
        type: "GET",
      });
    },
  };
  conf.module["API"] = API;
})(jQuery, window);
