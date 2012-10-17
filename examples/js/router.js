define(['backbone', 'app', 'staterouter'], function(Backbone, app, StateRouter) {
  var Router = StateRouter.extend({
    states: {
      'example':        'app.example',
      'closed':         'app.closed'
    },
    views: {
      'app':          [ 'views/layout' ],
      'app.example':  [ 'views/example' ],
      'app.closed':   [ 'views/closed' ]
    }
  });

  return new Router();
})
