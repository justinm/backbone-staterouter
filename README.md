## backbone-viewstate

The backbone-viewstate library allows for backbone apps to easily allow for multiple
entry points into the application.  This is possible by tieing views to states.  

### Requirements
* BackboneJS
* UnderscoreJS
* RequireJS

### Views

Each view can be bound to multiple "states" based on your apps configuration.  Each
time your app switches state, views are automatically created and destructed based on
the view definition.

### States

A state is simply a string that defines the application's state.  States can be
nested by period (.) separation.

An example state: app.a.b
