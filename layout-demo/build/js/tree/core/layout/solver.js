var Backbone, Constraint, Expression, Operator, Solver, Strength, Variable, _, _constrainer, kiwi;

_ = require("underscore");

Backbone = require("backbone");

kiwi = require("kiwi");

Variable = kiwi.Variable, Expression = kiwi.Expression, Constraint = kiwi.Constraint, Operator = kiwi.Operator, Strength = kiwi.Strength;

_constrainer = function(op) {
  return (function(_this) {
    return function() {
      var expr;
      expr = Object.create(Expression.prototype);
      Expression.apply(expr, arguments);
      return new Constraint(expr, op);
    };
  })(this);
};

Solver = (function() {
  function Solver() {
    this.num_constraints = 0;
    this.solver = new kiwi.Solver();
  }

  Solver.prototype.toString = function() {
    return "Solver[num_constraints=" + this.num_constraints + "]";
  };

  Solver.prototype.update_variables = function(trigger) {
    if (trigger == null) {
      trigger = true;
    }
    this.solver.updateVariables();
    if (trigger) {
      return this.trigger('layout_update');
    }
  };

  Solver.prototype.add_constraint = function(constraint) {
    this.num_constraints += 1;
    return this.solver.addConstraint(constraint);
  };

  Solver.prototype.remove_constraint = function(constraint) {
    this.num_constraints -= 1;
    return this.solver.removeConstraint(constraint);
  };

  Solver.prototype.add_edit_variable = function(variable, strength) {
    if (strength == null) {
      strength = Strength.strong;
    }
    this.num_constraints += 1;
    return this.solver.addEditVariable(variable, strength);
  };

  Solver.prototype.remove_edit_variable = function(variable) {
    this.num_constraints -= 1;
    return this.solver.removeEditVariable(variable, strength);
  };

  Solver.prototype.suggest_value = function(variable, value) {
    return this.solver.suggestValue(variable, value);
  };

  return Solver;

})();

_.extend(Solver.prototype, Backbone.Events);

module.exports = {
  Variable: Variable,
  Expression: Expression,
  Constraint: Constraint,
  Operator: Operator,
  Strength: Strength,
  EQ: _constrainer(Operator.Eq),
  LE: _constrainer(Operator.Le),
  GE: _constrainer(Operator.Ge),
  Solver: Solver
};
