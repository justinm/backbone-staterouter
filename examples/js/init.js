require.config({
  baseUrl: 'js',
  urlArgs: 'bust=' + (new Date()).getTime(),
  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    jquery: {
      exports: 'jQuery'
    },
    underscore: {
      exports: '_',
    }
  },
  paths: {
    backbone: 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.2/backbone-min',
    jquery: 'http://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.2/jquery.min',
    underscore: 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min',
    statemanager: '../../backbone.statemanager',
    viewmanager: '../../backbone.viewmanager'
  }
})

require(['app'], function(app) {
  app.start();
})
