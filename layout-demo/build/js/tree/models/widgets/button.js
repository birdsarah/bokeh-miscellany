var AbstractButton, BokehView, Button, ButtonView, _, build_views, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

AbstractButton = require("./abstract_button");

build_views = require("../../common/build_views");

BokehView = require("../../core/bokeh_view");

p = require("../../core/properties");

ButtonView = (function(superClass) {
  extend(ButtonView, superClass);

  function ButtonView() {
    return ButtonView.__super__.constructor.apply(this, arguments);
  }

  ButtonView.prototype.tagName = "button";

  ButtonView.prototype.events = {
    "click": "change_input"
  };

  ButtonView.prototype.initialize = function(options) {
    ButtonView.__super__.initialize.call(this, options);
    this.views = {};
    this.render();
    return this.listenTo(this.model, 'change', this.render);
  };

  ButtonView.prototype.render = function() {
    var icon, key, label, ref, val;
    icon = this.mget('icon');
    if (icon != null) {
      build_views(this.views, [icon]);
      ref = this.views;
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        val = ref[key];
        val.$el.detach();
      }
    }
    this.$el.empty();
    this.$el.addClass("bk-bs-btn");
    this.$el.addClass("bk-bs-btn-" + this.mget("type"));
    if (this.mget("disabled")) {
      this.$el.attr("disabled", "disabled");
    }
    label = this.mget("label");
    if (icon != null) {
      this.$el.append(this.views[icon.id].$el);
      label = " " + label;
    }
    this.$el.append(document.createTextNode(label));
    return this;
  };

  ButtonView.prototype.change_input = function() {
    var ref;
    this.mset('clicks', this.mget('clicks') + 1);
    return (ref = this.mget('callback')) != null ? ref.execute(this.model) : void 0;
  };

  return ButtonView;

})(BokehView);

Button = (function(superClass) {
  extend(Button, superClass);

  function Button() {
    return Button.__super__.constructor.apply(this, arguments);
  }

  Button.prototype.type = "Button";

  Button.prototype.default_view = ButtonView;

  Button.prototype.props = function() {
    return _.extend({}, Button.__super__.props.call(this), {
      clicks: [p.Number, 0]
    });
  };

  return Button;

})(AbstractButton.Model);

module.exports = {
  Model: Button,
  View: ButtonView
};
