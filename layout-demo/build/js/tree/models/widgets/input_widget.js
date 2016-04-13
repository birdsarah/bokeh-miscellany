var InputWidget, Widget, _, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

Widget = require("./widget");

p = require("../../core/properties");

InputWidget = (function(superClass) {
  extend(InputWidget, superClass);

  function InputWidget() {
    return InputWidget.__super__.constructor.apply(this, arguments);
  }

  InputWidget.prototype.type = "InputWidget";

  InputWidget.prototype.props = function() {
    return _.extend({}, InputWidget.__super__.props.call(this), {
      callback: [p.Instance],
      title: [p.String, '']
    });
  };

  return InputWidget;

})(Widget.Model);

module.exports = {
  Model: InputWidget
};
