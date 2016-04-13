var BokehView, Box, BoxView, EQ, GE, Model, Variable, WEAK_EQ, _, kiwi, mixin_layoutable, p, ref,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

kiwi = require("kiwi");

Variable = kiwi.Variable;

p = require("../core/properties");

BokehView = require("../core/bokeh_view");

Model = require("../model");

ref = require("./layoutable"), mixin_layoutable = ref.mixin_layoutable, EQ = ref.EQ, GE = ref.GE, WEAK_EQ = ref.WEAK_EQ;

BoxView = (function(superClass) {
  extend(BoxView, superClass);

  function BoxView() {
    return BoxView.__super__.constructor.apply(this, arguments);
  }

  BoxView.prototype.className = "bk-box";

  BoxView.prototype.initialize = function(options) {
    BoxView.__super__.initialize.call(this, options);
    this._created_child_views = false;
    return this.listenTo(this.model, 'change', this.render);
  };

  BoxView.prototype.render = function() {
    var child, children, j, len, view;
    if (!this._created_child_views) {
      children = this.model.get_layoutable_children();
      for (j = 0, len = children.length; j < len; j++) {
        child = children[j];
        view = new child.default_view({
          model: child
        });
        view.render();
        this.$el.append(view.$el);
      }
      this._created_child_views = true;
    }
    return this.$el.css({
      position: 'absolute',
      left: this.mget('dom_left'),
      top: this.mget('dom_top'),
      width: this.model._width._value,
      height: this.model._height._value
    });
  };

  return BoxView;

})(BokehView);

Box = (function(superClass) {
  extend(Box, superClass);

  Box.prototype.default_view = BoxView;

  function Box(attrs, options) {
    Box.__super__.constructor.call(this, attrs, options);
    this.set('dom_left', 0);
    this.set('dom_top', 0);
    this._width = new Variable();
    this._height = new Variable();
    this._child_equal_size_width = new Variable();
    this._child_equal_size_height = new Variable();
    this._box_equal_size_top = new Variable();
    this._box_equal_size_bottom = new Variable();
    this._box_equal_size_left = new Variable();
    this._box_equal_size_right = new Variable();
    this._box_cell_align_top = new Variable();
    this._box_cell_align_bottom = new Variable();
    this._box_cell_align_left = new Variable();
    this._box_cell_align_right = new Variable();
    this._whitespace_top = new Variable();
    this._whitespace_bottom = new Variable();
    this._whitespace_left = new Variable();
    this._whitespace_right = new Variable();
  }

  Box.prototype.props = function() {
    return _.extend({}, Box.__super__.props.call(this), {
      children: [p.Array, []],
      spacing: [p.Number, 6]
    });
  };

  Box.prototype._ensure_origin_variables = function(child) {
    if (!('__Box_x' in child)) {
      child['__Box_x'] = new Variable('child_origin_x');
    }
    if (!('__Box_y' in child)) {
      child['__Box_y'] = new Variable('child_origin_y');
    }
    return [child['__Box_x'], child['__Box_y']];
  };

  Box.prototype.get_constraints = function() {
    var add_equal_size_constraints, child, child_rect, children, i, info, j, k, last, len, next, rect, ref1, result, spacing, span, total, whitespace;
    children = this.get_layoutable_children();
    if (children.length === 0) {
      [];
    } else {
      child_rect = (function(_this) {
        return function(child) {
          var height, ref1, vars, width, x, y;
          vars = child.get_constrained_variables();
          width = vars['width'];
          height = vars['height'];
          ref1 = _this._ensure_origin_variables(child), x = ref1[0], y = ref1[1];
          return [x, y, width, height];
        };
      })(this);
      span = (function(_this) {
        return function(rect) {
          if (_this._horizontal) {
            return [rect[0], rect[2]];
          } else {
            return [rect[1], rect[3]];
          }
        };
      })(this);
      whitespace = (function(_this) {
        return function(child) {
          var vars;
          vars = child.get_constrained_variables();
          if (_this._horizontal) {
            return [vars['whitespace-left'], vars['whitespace-right']];
          } else {
            return [vars['whitespace-top'], vars['whitespace-bottom']];
          }
        };
      })(this);
      add_equal_size_constraints = (function(_this) {
        return function(child, constraints) {
          var vars;
          vars = child.get_constrained_variables();
          if (_this._horizontal) {
            if ('box-equal-size-left' in vars) {
              return constraints.push(EQ([-1, vars['box-equal-size-left']], [-1, vars['box-equal-size-right']], vars['width'], _this._child_equal_size_width));
            }
          } else {
            if ('box-equal-size-top' in vars) {
              return constraints.push(EQ([-1, vars['box-equal-size-top']], [-1, vars['box-equal-size-bottom']], vars['height'], _this._child_equal_size_height));
            }
          }
        };
      })(this);
      info = (function(_this) {
        return function(child) {
          return {
            span: span(child_rect(child)),
            whitespace: whitespace(child)
          };
        };
      })(this);
      result = [];
      spacing = this.get('spacing');
      for (j = 0, len = children.length; j < len; j++) {
        child = children[j];
        rect = child_rect(child);
        if (this._horizontal) {
          result.push(EQ(rect[3], [-1, this._height]));
        } else {
          result.push(EQ(rect[2], [-1, this._width]));
        }
        add_equal_size_constraints(child, result);
        result = result.concat(child.get_constraints());
      }
      last = info(children[0]);
      result.push(EQ(last.span[0], 0));
      for (i = k = 1, ref1 = children.length; 1 <= ref1 ? k < ref1 : k > ref1; i = 1 <= ref1 ? ++k : --k) {
        next = info(children[i]);
        result.push(EQ(last.span[0], last.span[1], [-1, next.span[0]]));
        result.push(WEAK_EQ(last.whitespace[1], next.whitespace[0], 0 - spacing));
        result.push(GE(last.whitespace[1], next.whitespace[0], 0 - spacing));
        last = next;
      }
      if (this._horizontal) {
        total = this._width;
      } else {
        total = this._height;
      }
      result.push(EQ(last.span[0], last.span[1], [-1, total]));
      result = result.concat(this._align_outer_edges_constraints(true));
      result = result.concat(this._align_outer_edges_constraints(false));
      result = result.concat(this._align_inner_cell_edges_constraints());
      result = result.concat(this._box_equal_size_bounds(true));
      result = result.concat(this._box_equal_size_bounds(false));
      result = result.concat(this._box_cell_align_bounds(true));
      result = result.concat(this._box_cell_align_bounds(false));
      result = result.concat(this._box_whitespace(true));
      result = result.concat(this._box_whitespace(false));
    }
    return result;
  };

  Box.prototype.get_constrained_variables = function() {
    return {
      'width': this._width,
      'height': this._height,
      'box-equal-size-top': this._box_equal_size_top,
      'box-equal-size-bottom': this._box_equal_size_bottom,
      'box-equal-size-left': this._box_equal_size_left,
      'box-equal-size-right': this._box_equal_size_right,
      'box-cell-align-top': this._box_cell_align_top,
      'box-cell-align-bottom': this._box_cell_align_bottom,
      'box-cell-align-left': this._box_cell_align_left,
      'box-cell-align-right': this._box_cell_align_right,
      'whitespace-top': this._whitespace_top,
      'whitespace-bottom': this._whitespace_bottom,
      'whitespace-left': this._whitespace_left,
      'whitespace-right': this._whitespace_right
    };
  };

  Box.prototype.get_layoutable_children = function() {
    return this.get('children');
  };

  Box._left_right_inner_cell_edge_variables = ['box-cell-align-left', 'box-cell-align-right'];

  Box._top_bottom_inner_cell_edge_variables = ['box-cell-align-top', 'box-cell-align-bottom'];

  Box.prototype._flatten_cell_edge_variables = function(horizontal) {
    var add_path, all_vars, arity, cell, cell_vars, child, children, direction, flattened, j, k, key, kind, len, len1, name, new_key, parsed, path, relevant_edges, variables;
    if (horizontal) {
      relevant_edges = Box._top_bottom_inner_cell_edge_variables;
    } else {
      relevant_edges = Box._left_right_inner_cell_edge_variables;
    }
    add_path = horizontal !== this._horizontal;
    children = this.get_layoutable_children();
    arity = children.length;
    flattened = {};
    cell = 0;
    for (j = 0, len = children.length; j < len; j++) {
      child = children[j];
      if (child instanceof Box) {
        cell_vars = child._flatten_cell_edge_variables(horizontal);
      } else {
        cell_vars = {};
      }
      all_vars = child.get_constrained_variables();
      for (k = 0, len1 = relevant_edges.length; k < len1; k++) {
        name = relevant_edges[k];
        if (name in all_vars) {
          cell_vars[name] = [all_vars[name]];
        }
      }
      for (key in cell_vars) {
        variables = cell_vars[key];
        if (add_path) {
          parsed = key.split(" ");
          kind = parsed[0];
          if (parsed.length > 1) {
            path = parsed[1];
          } else {
            path = "";
          }
          if (this._horizontal) {
            direction = "row";
          } else {
            direction = "col";
          }
          new_key = kind + " " + direction + "-" + arity + "-" + cell + "-" + path;
        } else {
          new_key = key;
        }
        if (new_key in flattened) {
          flattened[new_key] = flattened[new_key].concat(variables);
        } else {
          flattened[new_key] = variables;
        }
      }
      cell = cell + 1;
    }
    return flattened;
  };

  Box.prototype._align_inner_cell_edges_constraints = function() {
    var flattened, i, j, key, last, ref1, result, variables;
    flattened = this._flatten_cell_edge_variables(this._horizontal);
    result = [];
    for (key in flattened) {
      variables = flattened[key];
      if (variables.length > 1) {
        last = variables[0];
        for (i = j = 1, ref1 = variables.length; 1 <= ref1 ? j < ref1 : j > ref1; i = 1 <= ref1 ? ++j : --j) {
          result.push(EQ(variables[i], [-1, last]));
        }
      }
    }
    return result;
  };

  Box.prototype._find_edge_leaves = function(horizontal) {
    var child, child_leaves, children, end, j, leaves, len, start;
    children = this.get_layoutable_children();
    leaves = [[], []];
    if (children.length > 0) {
      if (this._horizontal === horizontal) {
        start = children[0];
        end = children[children.length - 1];
        if (start instanceof Box) {
          leaves[0] = leaves[0].concat(start._find_edge_leaves(horizontal)[0]);
        } else {
          leaves[0].push(start);
        }
        if (end instanceof Box) {
          leaves[1] = leaves[1].concat(end._find_edge_leaves(horizontal)[1]);
        } else {
          leaves[1].push(end);
        }
      } else {
        for (j = 0, len = children.length; j < len; j++) {
          child = children[j];
          if (child instanceof Box) {
            child_leaves = child._find_edge_leaves(horizontal);
            leaves[0] = leaves[0].concat(child_leaves[0]);
            leaves[1] = leaves[1].concat(child_leaves[1]);
          } else {
            leaves[0].push(child);
            leaves[1].push(child);
          }
        }
      }
    }
    return leaves;
  };

  Box.prototype._align_outer_edges_constraints = function(horizontal) {
    var add_all_equal, collect_vars, end_edges, end_leaves, end_variable, ref1, result, start_edges, start_leaves, start_variable;
    ref1 = this._find_edge_leaves(horizontal), start_leaves = ref1[0], end_leaves = ref1[1];
    if (horizontal) {
      start_variable = 'on-left-edge-align';
      end_variable = 'on-right-edge-align';
    } else {
      start_variable = 'on-top-edge-align';
      end_variable = 'on-bottom-edge-align';
    }
    collect_vars = function(leaves, name) {
      var edges, j, leaf, len, vars;
      edges = [];
      for (j = 0, len = leaves.length; j < len; j++) {
        leaf = leaves[j];
        vars = leaf.get_constrained_variables();
        if (name in vars) {
          edges.push(vars[name]);
        }
      }
      return edges;
    };
    start_edges = collect_vars(start_leaves, start_variable);
    end_edges = collect_vars(end_leaves, end_variable);
    result = [];
    add_all_equal = function(edges) {
      var edge, first, i, j, ref2;
      if (edges.length > 1) {
        first = edges[0];
        for (i = j = 1, ref2 = edges.length; 1 <= ref2 ? j < ref2 : j > ref2; i = 1 <= ref2 ? ++j : --j) {
          edge = edges[i];
          result.push(EQ([-1, first], edge));
        }
        return null;
      }
    };
    add_all_equal(start_edges);
    add_all_equal(end_edges);
    return result;
  };

  Box.prototype._box_insets_from_child_insets = function(horizontal, child_variable_prefix, our_variable_prefix, minimum) {
    var add_constraints, end_leaves, end_variable, our_end, our_start, ref1, result, start_leaves, start_variable;
    ref1 = this._find_edge_leaves(horizontal), start_leaves = ref1[0], end_leaves = ref1[1];
    if (horizontal) {
      start_variable = child_variable_prefix + "-left";
      end_variable = child_variable_prefix + "-right";
      our_start = this[our_variable_prefix + "_left"];
      our_end = this[our_variable_prefix + "_right"];
    } else {
      start_variable = child_variable_prefix + "-top";
      end_variable = child_variable_prefix + "-bottom";
      our_start = this[our_variable_prefix + "_top"];
      our_end = this[our_variable_prefix + "_bottom"];
    }
    result = [];
    add_constraints = function(ours, leaves, name) {
      var edges, j, leaf, len, vars;
      edges = [];
      for (j = 0, len = leaves.length; j < len; j++) {
        leaf = leaves[j];
        vars = leaf.get_constrained_variables();
        if (name in vars) {
          if (minimum) {
            result.push(GE([-1, ours], vars[name]));
          } else {
            result.push(EQ([-1, ours], vars[name]));
          }
        }
      }
      return null;
    };
    add_constraints(our_start, start_leaves, start_variable);
    add_constraints(our_end, end_leaves, end_variable);
    return result;
  };

  Box.prototype._box_equal_size_bounds = function(horizontal) {
    return this._box_insets_from_child_insets(horizontal, 'box-equal-size', '_box_equal_size', false);
  };

  Box.prototype._box_cell_align_bounds = function(horizontal) {
    return this._box_insets_from_child_insets(horizontal, 'box-cell-align', '_box_cell_align', false);
  };

  Box.prototype._box_whitespace = function(horizontal) {
    return this._box_insets_from_child_insets(horizontal, 'whitespace', '_whitespace', true);
  };

  Box.prototype.set_dom_origin = function(left, top) {
    return this.set({
      dom_left: left,
      dom_top: top
    });
  };

  Box.prototype.variables_updated = function() {
    var child, j, left, len, ref1, ref2, top;
    ref1 = this.get_layoutable_children();
    for (j = 0, len = ref1.length; j < len; j++) {
      child = ref1[j];
      ref2 = this._ensure_origin_variables(child), left = ref2[0], top = ref2[1];
      child.set_dom_origin(left._value, top._value);
      child.variables_updated();
    }
    return this.trigger('change');
  };

  return Box;

})(Model);

mixin_layoutable(Box);

module.exports = {
  Model: Box
};
