define(['backbone', 'app'], function(Backbone, app) {
  var ClosedView = Backbone.View.extend({
    entering: function() {
      this.render();
    },
    leaving: function() {
      this.close();
    },
    render: function() {
      this.$el.html('Successful').appendTo('.content');
      return this;
    },
    closeClicked: function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      app.router.navigate("closed");
      return false;
    },
    close: function() {
      this.$el.remove();
    }
  });

  return ClosedView;
})
