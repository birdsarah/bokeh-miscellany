var $, $1, BokehView, RadioButtonGroup, RadioButtonGroupView, Widget, _, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

$ = require("jquery");

$1 = require("bootstrap/button");

Widget = require("./widget");

BokehView = require("../../core/bokeh_view");

p = require("../../core/properties");

RadioButtonGroupView = (function(superClass) {
  extend(RadioButtonGroupView, superClass);

  function RadioButtonGroupView() {
    return RadioButtonGroupView.__super__.constructor.apply(this, arguments);
  }

  RadioButtonGroupView.prototype.tagName = "div";

  RadioButtonGroupView.prototype.events = {
    "change input": "change_input"
  };

  RadioButtonGroupView.prototype.initialize = function(options) {
    RadioButtonGroupView.__super__.initialize.call(this, options);
    this.render();
    return this.listenTo(this.model, 'change', this.render);
  };

  RadioButtonGroupView.prototype.render = function() {
    var $input, $label, active, i, j, label, len, name, ref;
    this.$el.empty();
    this.$el.addClass("bk-bs-btn-group");
    this.$el.attr("data-bk-bs-toggle", "buttons");
    name = _.uniqueId("RadioButtonGroup");
    active = this.mget("active");
    ref = this.mget("labels");
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      label = ref[i];
      $input = $('<input type="radio">').attr({
        name: name,
        value: "" + i
      });
      if (i === active) {
        $input.prop("checked", true);
      }
      $label = $('<label class="bk-bs-btn"></label>');
      $label.text(label).prepend($input);
      $label.addClass("bk-bs-btn-" + this.mget("type"));
      if (i === active) {
        $label.addClass("bk-bs-active");
      }
      this.$el.append($label);
    }
    return this;
  };

  RadioButtonGroupView.prototype.change_input = function() {
    var active, i, radio, ref;
    active = (function() {
      var j, len, ref, results;
      ref = this.$("input");
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        radio = ref[i];
        if (radio.checked) {
          results.push(i);
        }
      }
      return results;
    }).call(this);
    this.mset('active', active[0]);
    return (ref = this.mget('callback')) != null ? ref.execute(this.model) : void 0;
  };

  return RadioButtonGroupView;

})(BokehView);

RadioButtonGroup = (function(superClass) {
  extend(RadioButtonGroup, superClass);

  function RadioButtonGroup() {
    return RadioButtonGroup.__super__.constructor.apply(this, arguments);
  }

  RadioButtonGroup.prototype.type = "RadioButtonGroup";

  RadioButtonGroup.prototype.default_view = RadioButtonGroupView;

  RadioButtonGroup.prototype.props = function() {
    return _.extend({}, RadioButtonGroup.__super__.props.call(this), {
      active: [p.Any, null],
      labels: [p.Array, []],
      type: [p.String, "default"]
    });
  };

  return RadioButtonGroup;

})(Widget.Model);

module.exports = {
  Model: RadioButtonGroup,
  View: RadioButtonGroupView
};
