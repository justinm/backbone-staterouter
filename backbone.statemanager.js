define(['underscore', 'backbone'], function(_, Backbone) {

  StateManager = function() {
    this._currentState  = null;
    this._inStateChange = false;
    this._inMissedState = false;
    this._missedChanges = [];
  }

  _.extend(StateManager.prototype, Backbone.Events, {
    _processEvents: function(events, opts) {
      var $this = this;
      events['leave'].reverse();
      events['leave'].forEach(function(state) {
        //console.log('leave:', state);
        $this.trigger('leave:' + state, function() {}, opts);
      });
      events['enter'].forEach(function(state) {
        //console.log('enter:', state);
        $this.trigger('enter:' + state, function() {}, opts);
      });
      this._inStateChange = false;
      if(!this.inMissedState && this._missedChanges.length) {
        this.inMissedState = true;
        for(var i=0;i<this._missedChanges.length;i++)
          this.jumpTo.apply(this, this._missedChanges[i]);
        this._missedChanges = [];
        this.inMissedState = false;
      }
    },
    reload: function(state, opts) {
      this.jumpTo(state, opts, true);
    },
    jumpTo: function(state, opts, reload) {
      var $this       = this,
          newStates   = [],
          oldStates   = [],
          diffStates  = [],
          reload      = reload || false;

      newStates = this._splitState(state);
      if(this._currentState)
        oldStates = this._splitState(this._currentState);

      diffStates = this._diffStates(newStates, oldStates);

      this._processEvents(diffStates, opts);

      this._currentState = state;

      if(reload)
        this._processEvents({'enter': [this._currentState], 'leave': [this._currentState]}, opts);

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

    }
  });

  StateManager.extend = Backbone.Model.extend;

  return StateManager;

})
