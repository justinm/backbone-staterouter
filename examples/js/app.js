define(['backbone', 'statemanager', 'views'], function(Backbone, StateManager, views) {
  var state = new StateManager(),
      app = {
        stateManager: state,
        viewManager: views,
        router: null,
        start: function() {
          require(['router'], function(router) {
            app.router = router;
            if(!Backbone.history.start())
              router.navigate('example', true);
          })
        }
      }

  views.hook(state);

  return app;
})
