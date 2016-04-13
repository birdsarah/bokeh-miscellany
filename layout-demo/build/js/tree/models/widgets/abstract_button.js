var AbstractButton, Widget, _, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

Widget = require("./widget");

p = require("../../core/properties");

AbstractButton = (function(superClass) {
  extend(AbstractButton, superClass);

  function AbstractButton() {
    return AbstractButton.__super__.constructor.apply(this, arguments);
  }

  AbstractButton.prototype.type = "AbstractButton";

  AbstractButton.prototype.props = function() {
    return _.extend({}, AbstractButton.__super__.props.call(this), {
      callback: [p.Instance],
      label: [p.String, "Button"],
      icon: [p.String],
      type: [p.String, "default"]
    });
  };

  return AbstractButton;

})(Widget.Model);

module.exports = {
  Model: AbstractButton
};
