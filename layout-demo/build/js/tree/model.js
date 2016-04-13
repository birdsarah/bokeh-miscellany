var HasProps, Model, _, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

HasProps = require("./core/has_props");

p = require("./core/properties");

Model = (function(superClass) {
  extend(Model, superClass);

  function Model() {
    return Model.__super__.constructor.apply(this, arguments);
  }

  Model.prototype.type = "Model";

  Model.prototype.props = function() {
    return _.extend({}, Model.__super__.props.call(this), {
      tags: [p.Array, []],
      name: [p.String]
    });
  };

  return Model;

})(HasProps);

module.exports = Model;
