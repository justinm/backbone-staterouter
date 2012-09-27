define(['underscore', 'backbone'], function(_, Backbone) {

  var ViewManager = function() {
    this._cache = {};
  }

  _.extend(ViewManager.prototype, {
    hook: function(stateManager) {
      var $this = this;
      stateManager.on('all', function(route) {
        var parts = route.split(':'),
            args  = arguments[2];
        if(parts[0] != 'enter' && parts[0] != 'leave')
          return;
        if(parts[0] == 'enter')
          $this.enter.call($this, route.substr(6), args, null);
        if(parts[0] == 'leave')
          $this.leave.call($this, route.substr(6), args, null);
      })
    },
    enter: function(state, args, callback) {
      var $this     = this,
          viewSrc   = this.states[state],
          load      = [],
          views     = [];

      if(!viewSrc)
        return;

      if(!this._cache[state])
        this._cache[state] = [];

      for(var i=0;i<viewSrc.length;i++) {
        if(!this._cache[state][i])
          load.push(viewSrc[i]);
      }

      require(load, function() {
        var pos = 0;
        for(var i=0;i<$this.states[state].length;i++) {
          if($this._cache[state][i])
            view = $this._cache[state][i];
          else {
            view = new arguments[pos++]();
            $this._cache[state][i] = view;
          }
          view.entering.apply(view, args);
        }
        if(callback)
          callback(true);
      })

    },
    leave: function(state, args, callback) {
      for(var i=0;i<this._cache[state].length;i++) {
        var view = this._cache[state][i];
        view.leaving.apply(view, args);
        if(!view.cacheable || !view.cacheable())
          this._cache[state][i] = null;
      }
    },
  });

  ViewManager.extend = Backbone.Model.extend;

  return ViewManager;

})
