define(['viewmanager'], function(ViewManager) {

  var manager = ViewManager.extend({
    states: {
      'app': [
        'views/layout'
      ],
      'app.example': [
        'views/example'
      ],
      'app.closed': [
        'views/closed'
      ]
    }
  })

  return new manager;

})
