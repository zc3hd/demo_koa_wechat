(function($, window) {
  function Main_html() {
    var me = this;
    me.api = new conf.module.API();
  };
  Main_html.prototype = {
    init: function() {
      var me = this;
      // 
      me.event();
    },
    // 事件
    event: function() {
      var me = this;
      me._music();
    },
    // 音乐
    _music: function(argument) {
      var me = this;

      $("#music_audio_btn")
        .on('click', function() {
          // 暂停状态
          if ($("#music_audio_btn").hasClass("music_off")) {

            $("#music_audio_btn")
              .addClass("music_play_yinfu")
              .removeClass("music_off");

            $("#music_yinfu")
              .addClass("music_rotate");

            $("#music_media")[0].play();
          }
          // 播放状态
          else {
            $(this).addClass("music_off").removeClass("music_play_yinfu");
            $("#music_yinfu").removeClass("music_rotate");
            $("#music_media")[0].pause();
          }
        });
    },

  };
  conf.module["Main_html"] = Main_html;
})(jQuery, window);
