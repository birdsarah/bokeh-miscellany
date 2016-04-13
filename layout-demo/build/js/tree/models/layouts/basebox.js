var BaseBox, Layout, _, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

Layout = require("./layout");

p = require("../../core/properties");

BaseBox = (function(superClass) {
  extend(BaseBox, superClass);

  function BaseBox() {
    return BaseBox.__super__.constructor.apply(this, arguments);
  }

  BaseBox.prototype.type = "BaseBox";

  BaseBox.prototype.props = function() {
    return _.extend({}, BaseBox.__super__.props.call(this), {
      height: [p.Number, null],
      width: [p.Number, null]
    });
  };

  return BaseBox;

})(Layout.Model);

module.exports = {
  Model: BaseBox
};
