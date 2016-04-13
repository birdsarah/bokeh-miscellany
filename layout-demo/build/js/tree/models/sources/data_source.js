var DataSource, Model, _, hittest, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

Model = require("../../model");

hittest = require("../../common/hittest");

p = require("../../core/properties");

DataSource = (function(superClass) {
  extend(DataSource, superClass);

  function DataSource() {
    return DataSource.__super__.constructor.apply(this, arguments);
  }

  DataSource.prototype.type = 'DataSource';

  DataSource.prototype.props = function() {
    return _.extend({}, DataSource.__super__.props.call(this), {
      selected: [p.Any, hittest.create_hit_test_result()],
      callback: [p.Instance]
    });
  };

  DataSource.prototype.initialize = function(options) {
    DataSource.__super__.initialize.call(this, options);
    return this.listenTo(this, 'change:selected', (function(_this) {
      return function() {
        var ref;
        return (ref = _this.get('callback')) != null ? ref.execute(_this) : void 0;
      };
    })(this));
  };

  return DataSource;

})(Model);

module.exports = {
  Model: DataSource
};
