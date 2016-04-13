var $, BokehView, Constraint, DemoWidget, DemoWidgetView, EQ, Expression, GE, LE, Model, Operator, Variable, WEAK_EQ, WEAK_GE, WEAK_LE, _, kiwi, mixin_layoutable, p, ref,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

kiwi = require("kiwi");

Variable = kiwi.Variable, Expression = kiwi.Expression, Constraint = kiwi.Constraint, Operator = kiwi.Operator;

BokehView = require("../core/bokeh_view");

Model = require("../model");

ref = require("./layoutable"), mixin_layoutable = ref.mixin_layoutable, GE = ref.GE, EQ = ref.EQ, LE = ref.LE, WEAK_GE = ref.WEAK_GE, WEAK_EQ = ref.WEAK_EQ, WEAK_LE = ref.WEAK_LE;

$ = require("jquery");

_ = require("underscore");

p = require("../core/properties");

DemoWidgetView = (function(superClass) {
  extend(DemoWidgetView, superClass);

  function DemoWidgetView() {
    return DemoWidgetView.__super__.constructor.apply(this, arguments);
  }

  DemoWidgetView.prototype.className = 'bk-demo-widget';

  DemoWidgetView.prototype.initialize = function(options) {
    DemoWidgetView.__super__.initialize.call(this, options);
    this.listenTo(this.model, 'change', this.render);
    this._plot_element = $("<div class=\"bk-plot\" style=\"border: 1px solid black;\"></div>");
    this._title_element = $("<h4 style=\"margin: 0px; text-align: center;\"></h4>");
    this._left_axis_element = $("<div class=\"bk-left-axis\" style=\"border: 1px solid black;\"></div>");
    this._right_axis_element = $("<div class=\"bk-right-axis\" style=\"border: 1px solid black;\"></div>");
    this._bottom_axis_element = $("<div class=\"bk-bottom-axis\" style=\"border: 1px solid black;\"></div>");
    this.$el.append(this._plot_element, this._title_element, this._left_axis_element, this._right_axis_element, this._bottom_axis_element);
    return this.$el.prop('title', this.model.id);
  };

  DemoWidgetView.prototype.render = function() {
    this.$el.css({
      position: 'absolute',
      background: this.mget('background'),
      left: this.mget('dom_left'),
      top: this.mget('dom_top'),
      width: this.model._width._value,
      height: this.model._height._value
    });
    $(this._plot_element).css({
      position: 'absolute',
      left: this.model._plot_left._value,
      top: this.model._plot_top._value,
      width: this.model._plot_right._value - this.model._plot_left._value - 2,
      height: this.model._plot_bottom._value - this.model._plot_top._value - 2
    });
    $(this._title_element).text(this.mget('title'));
    $(this._title_element).css({
      position: 'absolute',
      display: this.mget('title') !== '' ? 'block' : 'none',
      left: this.model._plot_left._value,
      top: this.model._plot_top._value - this.model._title_height._value,
      width: this.model._plot_right._value - this.model._plot_left._value,
      height: this.model._title_height._value
    });
    $(this._left_axis_element).css({
      position: 'absolute',
      display: this.mget('left_axis') ? 'block' : 'none',
      left: this.model._plot_left._value - this.model._left_axis_width._value,
      top: this.model._plot_top._value,
      width: this.model._left_axis_width._value - 2 - 3,
      height: this.model._plot_bottom._value - this.model._plot_top._value - 2
    });
    $(this._right_axis_element).css({
      position: 'absolute',
      display: this.mget('right_axis') ? 'block' : 'none',
      left: this.model._plot_right._value + 3,
      top: this.model._plot_top._value,
      width: this.model._right_axis_width._value - 2 - 3,
      height: this.model._plot_bottom._value - this.model._plot_top._value - 2
    });
    return $(this._bottom_axis_element).css({
      position: 'absolute',
      display: this.mget('bottom_axis') ? 'block' : 'none',
      left: this.model._plot_left._value,
      top: this.model._plot_bottom._value + 3,
      width: this.model._plot_right._value - this.model._plot_left._value - 2,
      height: this.model._bottom_axis_height._value - 2 - 3
    });
  };

  return DemoWidgetView;

})(BokehView);

DemoWidget = (function(superClass) {
  extend(DemoWidget, superClass);

  DemoWidget.prototype.default_view = DemoWidgetView;

  function DemoWidget(attrs, options) {
    DemoWidget.__super__.constructor.call(this, attrs, options);
    this.set('dom_left', 0);
    this.set('dom_top', 0);
    this._width = new Variable();
    this._height = new Variable();
    this._plot_left = new Variable();
    this._plot_right = new Variable();
    this._plot_top = new Variable();
    this._plot_bottom = new Variable();
    this._width_minus_plot_right = new Variable();
    this._height_minus_plot_bottom = new Variable();
    this._plot_right_minus_plot_left = new Variable();
    this._plot_bottom_minus_plot_top = new Variable();
    this._whitespace_left = new Variable();
    this._whitespace_right = new Variable();
    this._whitespace_top = new Variable();
    this._whitespace_bottom = new Variable();
    this._left_axis_width = new Variable();
    this._right_axis_width = new Variable();
    this._bottom_axis_height = new Variable();
    this._title_height = new Variable();
  }

  DemoWidget.prototype.props = function() {
    return _.extend({}, DemoWidget.__super__.props.call(this), {
      background: [p.String, 'white'],
      title: [p.String, ''],
      left_axis: [p.Bool, true],
      right_axis: [p.Bool, false],
      bottom_axis: [p.Bool, true],
      min_plot_width: [p.Number, 40],
      min_plot_height: [p.Number, 40]
    });
  };

  DemoWidget.prototype.get_constraints = function() {
    var result;
    result = [];
    result.push(EQ([-1, this._plot_right], this._plot_left, this._plot_right_minus_plot_left));
    result.push(EQ([-1, this._plot_bottom], this._plot_top, this._plot_bottom_minus_plot_top));
    result.push(WEAK_GE(this._plot_right_minus_plot_left, -this.get('min_plot_width')));
    result.push(WEAK_GE(this._plot_bottom_minus_plot_top, -this.get('min_plot_height')));
    result.push(WEAK_EQ(this._whitespace_left));
    result.push(WEAK_EQ(this._whitespace_right));
    result.push(WEAK_EQ(this._whitespace_top));
    result.push(WEAK_EQ(this._whitespace_bottom));
    result.push(GE(this._whitespace_left));
    result.push(GE(this._whitespace_right));
    result.push(GE(this._whitespace_top));
    result.push(GE(this._whitespace_bottom));
    if (this.get('left_axis')) {
      result.push(EQ(this._left_axis_width, -20));
    } else {
      result.push(EQ(this._left_axis_width));
    }
    if (this.get('right_axis')) {
      result.push(EQ(this._right_axis_width, -20));
    } else {
      result.push(EQ(this._right_axis_width));
    }
    if (this.get('bottom_axis')) {
      result.push(EQ(this._bottom_axis_height, -20));
    } else {
      result.push(EQ(this._bottom_axis_height));
    }
    if (this.get('title') !== '') {
      result.push(EQ(this._title_height, -25));
    } else {
      result.push(EQ(this._title_height));
    }
    result.push(GE(this._plot_left));
    result.push(GE(this._width, [-1, this._plot_right]));
    result.push(GE(this._plot_top));
    result.push(GE(this._height, [-1, this._plot_bottom]));
    result.push(EQ(this._whitespace_left, this._left_axis_width, [-1, this._plot_left]));
    result.push(EQ(this._plot_right, this._right_axis_width, this._whitespace_right, [-1, this._width]));
    result.push(EQ(this._whitespace_top, this._title_height, [-1, this._plot_top]));
    result.push(EQ(this._plot_bottom, this._bottom_axis_height, this._whitespace_bottom, [-1, this._height]));
    result.push(EQ(this._height_minus_plot_bottom, [-1, this._height], this._plot_bottom));
    result.push(EQ(this._width_minus_plot_right, [-1, this._width], this._plot_right));
    return result;
  };

  DemoWidget.prototype.get_constrained_variables = function() {
    return {
      'width': this._width,
      'height': this._height,
      'on-top-edge-align': this._plot_top,
      'on-bottom-edge-align': this._height_minus_plot_bottom,
      'on-left-edge-align': this._plot_left,
      'on-right-edge-align': this._width_minus_plot_right,
      'box-cell-align-top': this._plot_top,
      'box-cell-align-bottom': this._height_minus_plot_bottom,
      'box-cell-align-left': this._plot_left,
      'box-cell-align-right': this._width_minus_plot_right,
      'box-equal-size-top': this._plot_top,
      'box-equal-size-bottom': this._height_minus_plot_bottom,
      'box-equal-size-left': this._plot_left,
      'box-equal-size-right': this._width_minus_plot_right,
      'whitespace-top': this._whitespace_top,
      'whitespace-bottom': this._whitespace_bottom,
      'whitespace-left': this._whitespace_left,
      'whitespace-right': this._whitespace_right
    };
  };

  DemoWidget.prototype.get_layoutable_children = function() {
    return [];
  };

  DemoWidget.prototype.set_dom_origin = function(left, top) {
    return this.set({
      dom_left: left,
      dom_top: top
    });
  };

  DemoWidget.prototype.variables_updated = function() {
    return this.trigger('change');
  };

  return DemoWidget;

})(Model);

mixin_layoutable(DemoWidget);

module.exports = {
  Model: DemoWidget
};
