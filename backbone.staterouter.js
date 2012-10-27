define(['underscore', 'backbone'], function(_, Backbone) {

  StateRouter = function(opts) {
    this._currentState  = null;
    this._inMissedState = false;
    this._missedStates = [];
    this._viewCache = {};
    this._inChange = false;
    this._viewQueue = [];

    this._bindStates();
    this._attachViews();
    Backbone.Router.call(this, opts);
  }

  _.extend(StateRouter.prototype, Backbone.Router.prototype, {
    jumpTo: function(state, opts) {
      var $this       = this,
          newStates   = [],
          oldStates   = [],
          diffStates  = [],
          reload      = reload || false,
          opts        = opts || {};

      newStates = this._splitState(state);
      if(this._currentState)
        oldStates = this._splitState(this._currentState);

      diffStates = this._diffStates(newStates, oldStates);

      this._changeStates(diffStates, opts);

      this._currentState = state;
    },
    _bindStates: function() {
      if(!this.states)
        return;
      var states  = [],
          $this   = this;
      for(state in this.states)
        states.unshift([state, this.states[state]]);;

      for(var i=0; i<states.length; i++) {
        (function() {
          var fragment  = states[i][0],
              state     = states[i][1];

          $this.route(fragment, '', function() {
            $this.jumpTo(state, {args: arguments});
          });
        })();
      }

      _.each(states, function(state, fragment) {
      });
    },
    _changeStates: function(states, opts) {
      var $this = this;
      states['leave'].reverse();
      states['leave'].forEach(function(state) {
        $this.trigger('leave:' + state, opts);
      });
      states['enter'].forEach(function(state) {
        $this.trigger('enter:' + state, opts);
      });
      if(!this.inMissedState && this._missedStates.length) {
        this.inMissedState = true;
        for(var i=0;i<this._missedStates.length;i++)
          this.jumpTo.apply(this, this._missedStates[i]);
        this._missedStates = [];
        this.inMissedState = false;
      }
    },
    _diffStates: function(newStates, oldStates) {
      var ret     = {enter: [], leave: []},
          diff    = 0;

      for(var i=0;i<oldStates.length;i++) {
        if(!diff && oldStates[i] != newStates[i])
          diff = i;

          if(diff)
            ret['leave'].push(oldStates[i]);
      }

      if(!diff)
        diff = oldStates.length;

      for(var i=0;i<newStates.length;i++) {

        if(i >= diff)
          ret['enter'].push(newStates[i]);
      }

      return ret;
    },
    _splitState: function(state) {
      var parts = state.split('.'),
          tmp   = "",
          ret   = [];

      for(var i=0;i<parts.length;i++) {
        tmp = (tmp ? tmp + '.' : '') + parts[i];
        ret.push(tmp);
      }

      return ret;
    },

    _attachViews: function() {
      var $this = this;
      this.on('all', function(route) {
        var parts = route.split(':'),
            args  = arguments[1];
        if(parts[0] != 'enter' && parts[0] != 'leave')
          return;
        if(parts[0] == 'enter')
          $this.enterView.call($this, route.substr(6), args, null);
        if(parts[0] == 'leave')
          $this.leaveView.call($this, route.substr(6), args, null);
      })
    },
    enterView: function(state, args, callback) {
      var $this     = this,
          viewSrc   = this.views[state],
          load      = [],
          views     = [];

      if(!viewSrc)
        return;

      if(this._inChange)
        return this._viewQueue.push([state, args, callback]);

      this._inChange = true;

      if(!this._viewCache[state])
        this._viewCache[state] = [];

      for(var i=0;i<viewSrc.length;i++) {
        if(!this._viewCache[state][i])
          load.push(viewSrc[i]);
      }

      require(load, function() {
        var pos = 0,
            cur = 0,
            loaded = arguments;

        var loadViews = function(start, skip) {
          for(var i=start;i<$this.views[state].length;i++) {
            if($this._viewCache[state][i])
              view = $this._viewCache[state][i];
            else {
              view = new loaded[pos++](args);
              $this._viewCache[state][i] = view;
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

          if($this._viewQueue.length) {
            var q = $this._viewQueue.pop();
            $this.enterView.apply($this, q);
          }
          if(callback)
            callback(true);
        }
        loadViews(0);
      })

    },
    leaveView: function(state, args, callback) {
      if(!this._viewCache[state])
        return;

      for(var i=0;i<this._viewCache[state].length;i++) {
        var view = this._viewCache[state][i];
        if(view.close != undefined)
          view.close.call(view);
        else
          view.remove.call(view);
        if(!view.cacheable || !view.cacheable())
          delete this._viewCache[state][i];
      }
    }
  });

  StateRouter.extend = Backbone.Model.extend;

  return StateRouter;

})
