define(['backbone', 'app'], function(Backbone, app) {
  var ExampleView = Backbone.View.extend({
    events: {
      'click .close': 'closeClicked'
    },
    entering: function() {
      this.render();
    },
    leaving: function() {
      this.close();
    },
    render: function() {
      this.$el.html('An Example View <a href="#" class="close">close</a>').appendTo('.content');
      return this;
    },
    closeClicked: function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      app.router.navigate("closed", true);
      return false;
    },
    close: function() {
      this.$el.remove();
    }
  });

  return ExampleView;
})
