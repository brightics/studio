var Studio = (function ($parent, options) {
  var instance = createInstance($parent, options);

  function createInstance($parent, options) {
      var object = new Brightics.VA.Studio($parent, options);
      return object;
  }

  return {
      getInstance: function () {
          if (!instance) {
              instance = createInstance($parent, options);
          }
          return instance;
      },
      getResourceManager: function () {
          return this.getInstance().getResourceManager();
      },
      getSession: function () {
          return this.getInstance().getSession();
      },
      getLayoutManager: function () {
          return this.getInstance().getLayoutManager();
      },
      getPreference: function () {
          return this.getInstance().getPreference();
      },
      getValidator: function () {
          return this.getInstance().getValidator();
      },
      getResourceService: function () {
          return this.getInstance().getResourceService();
      },
      getJobExecutor: function () {
          return this.getInstance().getJobExecutor();
      },
      getEditorContainer: function () {
          return this.getInstance().getEditorContainer();
      },
      getClipboardManager: function () {
          return this.getInstance().getClipboardManager();
      },
      getActiveEditor: function () {
          return this.getInstance().getActiveEditor();
      }
  };
})($(".brtc-va-main"), {userId: user, permissions: JSON.parse(permissions), logLevel: logLevel, isPublish: window.isPublish});

$(function () {
  $('#brightics').perfectScrollbar();
  $(window).on('resize', function () {
      $('#brightics').perfectScrollbar('update');
  });
  var heartbeat = setInterval(function () {
      if (!$.cookie('brightics.va.sid')) {
          clearInterval(heartbeat);
          $.get('/api/va/v2/users/my');
      }
  }, 60000);
});