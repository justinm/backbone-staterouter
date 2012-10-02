define(['underscore', 'backbone'], function(_, Backbone) {

  var ViewManager = function() {
    this._cache = {};
    this._inChange = false;
    this._inMissing = false;
    this._queue = [];
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

      if(this._inChange)
        return this._queue.push([state, args, callback]);

      this._inChange = true;

      if(!this._cache[state])
        this._cache[state] = [];

      for(var i=0;i<viewSrc.length;i++) {
        if(!this._cache[state][i])
          load.push(viewSrc[i]);
      }

      require(load, function() {
        var pos = 0,
            cur = 0,
            loaded = arguments;

        var loadViews = function(start, skip) {
          for(var i=start;i<$this.states[state].length;i++) {
            if($this._cache[state][i])
              view = $this._cache[state][i];
            else {
              view = new loaded[pos++](args);
              $this._cache[state][i] = view;
            }
            if(view.prep != undefined) {
              if(!skip) {
                view.prep(function(success) {
                  if(success)
                    loadViews(i, true);
                });
                return false;
              }
              skip = false;
            }
            view.render.apply(view);
          }
          $this._inChange = false;

          if(!$this._inMissing && $this._queue.length) {
            $this._inMissing = true;
            while($this._queue.length) {
              $this.enter.apply($this, $this._queue.pop());
            }
            $this._inMissing = false;
          }
          if(callback)
            callback(true);
        }
        loadViews(0);
      })

    },
    leave: function(state, args, callback) {
      if(!this._cache[state])
        return;

      for(var i=0;i<this._cache[state].length;i++) {
        var view = this._cache[state][i];
        if(view.close != undefined)
          view.close.call(view);
        else
          view.remove.call(view);
        if(!view.cacheable || !view.cacheable())
          delete this._cache[state][i];
      }
    }
  });

  ViewManager.extend = Backbone.Model.extend;

  return ViewManager;

})
