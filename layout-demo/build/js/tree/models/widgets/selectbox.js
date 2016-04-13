var BokehView, InputWidget, Select, SelectView, _, logger, p, template,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

InputWidget = require("./input_widget");

template = require("./selecttemplate");

BokehView = require("../../core/bokeh_view");

logger = require("../../core/logging").logger;

p = require("../../core/properties");

SelectView = (function(superClass) {
  extend(SelectView, superClass);

  function SelectView() {
    return SelectView.__super__.constructor.apply(this, arguments);
  }

  SelectView.prototype.tagName = "div";

  SelectView.prototype.template = template;

  SelectView.prototype.events = {
    "change select": "change_input"
  };

  SelectView.prototype.change_input = function() {
    var ref, value;
    value = this.$('select').val();
    logger.debug("selectbox: value = " + value);
    this.mset('value', value);
    return (ref = this.mget('callback')) != null ? ref.execute(this.model) : void 0;
  };

  SelectView.prototype.initialize = function(options) {
    SelectView.__super__.initialize.call(this, options);
    this.render();
    return this.listenTo(this.model, 'change', this.render);
  };

  SelectView.prototype.render = function() {
    var html;
    this.$el.empty();
    html = this.template(this.model.attributes);
    this.$el.html(html);
    return this;
  };

  return SelectView;

})(BokehView);

Select = (function(superClass) {
  extend(Select, superClass);

  function Select() {
    return Select.__super__.constructor.apply(this, arguments);
  }

  Select.prototype.type = "Select";

  Select.prototype.default_view = SelectView;

  Select.prototype.props = function() {
    return _.extend({}, Select.__super__.props.call(this), {
      value: [p.String, ''],
      options: [p.Any, []]
    });
  };

  return Select;

})(InputWidget.Model);

module.exports = {
  Model: Select,
  View: SelectView
};
