define(['backbone', 'app'], function(Backbone, app) {
  var Router = Backbone.Router.extend({
    routes: {
      'example':      'example',
      'closed':       'closed'
    },
    example: function() {
      app.stateManager.jumpTo('app.example');
    },
    closed: function() {
      app.stateManager.jumpTo('app.closed');
    }
  });

  return new Router();
})
