define(['backbone'], function(Backbone) {
  var LayoutView = Backbone.View.extend({
    entering: function() {
      this.render();
    },
    leaving: function() {
      this.close();
    },
    render: function() {
      var html  = '<div class="header">Layout Header</div>';
          html += '<div class="content"></div>';
          html += '<div class="footer">Layout Footer</div>';

      this.$el.html(html).appendTo('body');

      return this;
    },
    close: function() {
      this.$el.remove();
    }
  });

  return LayoutView;
})
