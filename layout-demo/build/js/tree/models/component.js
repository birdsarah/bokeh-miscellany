var Component, Model, _, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

Model = require("../model");

p = require("../core/properties");

Component = (function(superClass) {
  extend(Component, superClass);

  function Component() {
    return Component.__super__.constructor.apply(this, arguments);
  }

  Component.prototype.type = "Component";

  Component.prototype.props = function() {
    return _.extend({}, Component.__super__.props.call(this), {
      disabled: [p.Bool, false]
    });
  };

  return Component;

})(Model);

module.exports = {
  Model: Component
};
