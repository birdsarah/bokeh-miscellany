var $, BokehView, Panel, PanelView, Widget, _, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

$ = require("jquery");

Widget = require("./widget");

BokehView = require("../../core/bokeh_view");

p = require("../../core/properties");

PanelView = (function(superClass) {
  extend(PanelView, superClass);

  function PanelView() {
    return PanelView.__super__.constructor.apply(this, arguments);
  }

  PanelView.prototype.initialize = function(options) {
    PanelView.__super__.initialize.call(this, options);
    return this.render();
  };

  PanelView.prototype.render = function() {
    this.$el.empty();
    return this;
  };

  return PanelView;

})(BokehView);

Panel = (function(superClass) {
  extend(Panel, superClass);

  function Panel() {
    return Panel.__super__.constructor.apply(this, arguments);
  }

  Panel.prototype.type = "Panel";

  Panel.prototype.default_view = PanelView;

  Panel.prototype.props = function() {
    return _.extend({}, Panel.__super__.props.call(this), {
      title: [p.String, ""],
      child: [p.Instance],
      closable: [p.Bool, false]
    });
  };

  return Panel;

})(Widget.Model);

module.exports = {
  Model: Panel,
  View: PanelView
};
