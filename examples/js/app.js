define(['backbone', 'router'], function(Backbone, router) {
    var app = {
      router: router,
      start: function() {
        if(!Backbone.history.start())
          router.navigate('example', true);
      }
    }

  return app;
})
