var Div, DivView, Markup, _, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

Markup = require("./markup");

p = require("../../core/properties");

DivView = (function(superClass) {
  extend(DivView, superClass);

  function DivView() {
    return DivView.__super__.constructor.apply(this, arguments);
  }

  DivView.prototype.tagName = "div";

  DivView.prototype.render = function() {
    DivView.__super__.render.call(this);
    if (this.mget('render_as_text') === true) {
      this.$el.text(this.mget('text'));
    } else {
      this.$el.html(this.mget('text'));
    }
    return this;
  };

  return DivView;

})(Markup.View);

Div = (function(superClass) {
  extend(Div, superClass);

  function Div() {
    return Div.__super__.constructor.apply(this, arguments);
  }

  Div.prototype.type = "Div";

  Div.prototype.default_view = DivView;

  Div.define({
    render_as_text: [p.Bool, false]
  });

  return Div;

})(Markup.Model);

module.exports = {
  Model: Div,
  View: DivView
};
