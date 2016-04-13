var ColumnDataSource, RemoteDataSource, _, p,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

ColumnDataSource = require("./column_data_source");

p = require("../../core/properties");

RemoteDataSource = (function(superClass) {
  extend(RemoteDataSource, superClass);

  function RemoteDataSource() {
    this.props = bind(this.props, this);
    return RemoteDataSource.__super__.constructor.apply(this, arguments);
  }

  RemoteDataSource.prototype.type = 'RemoteDataSource';

  RemoteDataSource.prototype.props = function() {
    return _.extend({}, RemoteDataSource.__super__.props.call(this), {
      data: [p.Any, {}],
      data_url: [p.String],
      polling_interval: [p.Number]
    });
  };

  return RemoteDataSource;

})(ColumnDataSource.Model);

module.exports = {
  Model: RemoteDataSource
};
