var Range, Range1d, _, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

Range = require("./range");

p = require("../../core/properties");

Range1d = (function(superClass) {
  extend(Range1d, superClass);

  function Range1d() {
    return Range1d.__super__.constructor.apply(this, arguments);
  }

  Range1d.prototype.type = 'Range1d';

  Range1d.prototype.props = function() {
    return _.extend({}, Range1d.__super__.props.call(this), {
      start: [p.Number, 0],
      end: [p.Number, 1],
      bounds: [p.Any]
    });
  };

  Range1d.prototype._set_auto_bounds = function() {
    var max, min;
    if (this.get('bounds') === 'auto') {
      min = Math.min(this._initial_start, this._initial_end);
      max = Math.max(this._initial_start, this._initial_end);
      return this.set('bounds', [min, max]);
    }
  };

  Range1d.prototype.initialize = function(attrs, options) {
    Range1d.__super__.initialize.call(this, attrs, options);
    this.register_property('min', function() {
      return Math.min(this.get('start'), this.get('end'));
    }, true);
    this.add_dependencies('min', this, ['start', 'end']);
    this.register_property('max', function() {
      return Math.max(this.get('start'), this.get('end'));
    }, true);
    this.add_dependencies('max', this, ['start', 'end']);
    this._initial_start = this.get('start');
    this._initial_end = this.get('end');
    return this._set_auto_bounds();
  };

  Range1d.prototype.reset = function() {
    this.set({
      start: this._initial_start,
      end: this._initial_end
    });
    return this._set_auto_bounds();
  };

  return Range1d;

})(Range.Model);

module.exports = {
  Model: Range1d
};
