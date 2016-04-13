var Constraint, EQ, Eq, Expression, GE, Ge, LE, Layoutable, Le, Operator, Variable, WEAK_EQ, WEAK_GE, WEAK_LE, _, _constrainer, _weak_constrainer, kiwi, mixin_layoutable, p;

_ = require("underscore");

kiwi = require("kiwi");

Variable = kiwi.Variable, Expression = kiwi.Expression, Constraint = kiwi.Constraint, Operator = kiwi.Operator;

Eq = Operator.Eq, Le = Operator.Le, Ge = Operator.Ge;

p = require("../core/properties");

Layoutable = (function() {
  function Layoutable() {}

  Layoutable.prototype._constraints_invalid = true;

  Layoutable.prototype._paint_invalid = true;

  Layoutable.prototype.constraints_invalid = function() {
    return this._constraints_invalid;
  };

  Layoutable.prototype.paint_invalid = function() {
    return this._paint_invalid;
  };

  Layoutable.prototype.invalidate_constraints = function() {
    return this._constraints_invalid = true;
  };

  Layoutable.prototype.invalidate_paint = function() {
    return this._paint_invalid = true;
  };

  Layoutable.prototype.validate_constraints = function() {
    return this._constraints_invalid = true;
  };

  Layoutable.prototype.validate_paint = function() {
    return this._paint_invalid = true;
  };

  return Layoutable;

})();

mixin_layoutable = function(klass) {
  var i, len, method, proto, ref;
  proto = klass.prototype;
  ref = ['get_constraints', 'get_constrained_variables', 'get_layoutable_children', 'set_dom_origin', 'variables_updated'];
  for (i = 0, len = ref.length; i < len; i++) {
    method = ref[i];
    if (!method in proto) {
      throw new Error("Method " + method + " required in Layoutable classes");
    }
  }
  return _.extend(proto, Layoutable);
};

_constrainer = function(op) {
  return function() {
    var arg, args, i, len;
    args = [null];
    for (i = 0, len = arguments.length; i < len; i++) {
      arg = arguments[i];
      args.push(arg);
    }
    return new Constraint(new (Function.prototype.bind.apply(Expression, args)), op);
  };
};

EQ = _constrainer(Operator.Eq);

GE = _constrainer(Operator.Ge);

LE = _constrainer(Operator.Le);

_weak_constrainer = function(op) {
  return function() {
    var arg, args, i, len;
    args = [null];
    for (i = 0, len = arguments.length; i < len; i++) {
      arg = arguments[i];
      args.push(arg);
    }
    return new Constraint(new (Function.prototype.bind.apply(Expression, args)), op, kiwi.Strength.weak);
  };
};

WEAK_EQ = _weak_constrainer(Operator.Eq);

WEAK_GE = _weak_constrainer(Operator.Ge);

WEAK_LE = _weak_constrainer(Operator.Le);

module.exports = {
  mixin_layoutable: mixin_layoutable,
  EQ: EQ,
  GE: GE,
  LE: LE,
  WEAK_EQ: WEAK_EQ,
  WEAK_GE: WEAK_GE,
  WEAK_LE: WEAK_LE
};
