var EQ, GE, LayoutBox, Model, Range1d, Strength, Variable, _, ref,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

ref = require("../../core/layout/solver"), Variable = ref.Variable, EQ = ref.EQ, GE = ref.GE, Strength = ref.Strength;

Model = require("../../model");

Range1d = require("../ranges/range1d");

LayoutBox = (function(superClass) {
  extend(LayoutBox, superClass);

  function LayoutBox() {
    return LayoutBox.__super__.constructor.apply(this, arguments);
  }

  LayoutBox.prototype.type = 'LayoutBox';

  LayoutBox.prototype.nonserializable_attribute_names = function() {
    return LayoutBox.__super__.nonserializable_attribute_names.call(this).concat(['layout_location']);
  };

  LayoutBox.prototype._doc_attached = function() {
    var i, j, len, len1, name, ref1, ref2, solver, v;
    solver = this.document.solver();
    this.var_constraints = {};
    ref1 = ['top', 'left', 'width', 'height'];
    for (i = 0, len = ref1.length; i < len; i++) {
      v = ref1[i];
      name = '_' + v;
      this[name] = new Variable(v);
      this.register_property(v, this._get_var, false);
      solver.add_edit_variable(this[name], Strength.strong);
    }
    ref2 = ['right', 'bottom'];
    for (j = 0, len1 = ref2.length; j < len1; j++) {
      v = ref2[j];
      name = '_' + v;
      this[name] = new Variable(v);
      this.register_property(v, this._get_var, false);
    }
    solver.add_constraint(GE(this._top));
    solver.add_constraint(GE(this._bottom));
    solver.add_constraint(GE(this._left));
    solver.add_constraint(GE(this._right));
    solver.add_constraint(GE(this._width));
    solver.add_constraint(GE(this._height));
    solver.add_constraint(EQ(this._left, this._width, [-1, this._right]));
    solver.add_constraint(EQ(this._bottom, this._height, [-1, this._top]));
    this._h_range = new Range1d.Model({
      start: this.get('left'),
      end: this.get('left') + this.get('width')
    });
    this.register_property('h_range', (function(_this) {
      return function() {
        _this._h_range.set('start', _this.get('left'));
        _this._h_range.set('end', _this.get('left') + _this.get('width'));
        return _this._h_range;
      };
    })(this), false);
    this.add_dependencies('h_range', this, ['left', 'width']);
    this._v_range = new Range1d.Model({
      start: this.get('bottom'),
      end: this.get('bottom') + this.get('height')
    });
    this.register_property('v_range', (function(_this) {
      return function() {
        _this._v_range.set('start', _this.get('bottom'));
        _this._v_range.set('end', _this.get('bottom') + _this.get('height'));
        return _this._v_range;
      };
    })(this), false);
    this.add_dependencies('v_range', this, ['bottom', 'height']);
    this._aspect_constraint = null;
    this.register_property('aspect', (function(_this) {
      return function() {
        return _this.get('width') / _this.get('height');
      };
    })(this), true);
    return this.add_dependencies('aspect', this, ['width', 'height']);
  };

  LayoutBox.prototype.contains = function(vx, vy) {
    return vx >= this.get('left') && vx <= this.get('right') && vy >= this.get('bottom') && vy <= this.get('top');
  };

  LayoutBox.prototype.set_var = function(name, value) {
    var v;
    v = this['_' + name];
    return this.document.solver().suggest_value(v, value);
  };

  LayoutBox.prototype._get_var = function(prop_name) {
    return this['_' + prop_name].value();
  };

  LayoutBox.prototype.set_aspect = function(aspect) {
    var c;
    if (this._aspect_constraint != null) {
      solver.remove_constraint(this.aspect_constraint);
      c = EQ([aspect, this._height], [-1, this._width]);
      this._aspect_constraint = c;
      return this.document.solver().add_constraint(c);
    }
  };

  return LayoutBox;

})(Model);

module.exports = {
  Model: LayoutBox
};
