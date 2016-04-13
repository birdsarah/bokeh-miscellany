var $, BokehView, RadioGroup, RadioGroupView, Widget, _, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

$ = require("jquery");

Widget = require("./widget");

BokehView = require("../../core/bokeh_view");

p = require("../../core/properties");

RadioGroupView = (function(superClass) {
  extend(RadioGroupView, superClass);

  function RadioGroupView() {
    return RadioGroupView.__super__.constructor.apply(this, arguments);
  }

  RadioGroupView.prototype.tagName = "div";

  RadioGroupView.prototype.events = {
    "change input": "change_input"
  };

  RadioGroupView.prototype.initialize = function(options) {
    RadioGroupView.__super__.initialize.call(this, options);
    this.render();
    return this.listenTo(this.model, 'change', this.render);
  };

  RadioGroupView.prototype.render = function() {
    var $div, $input, $label, active, i, j, label, len, name, ref;
    this.$el.empty();
    name = _.uniqueId("RadioGroup");
    active = this.mget("active");
    ref = this.mget("labels");
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      label = ref[i];
      $input = $('<input type="radio">').attr({
        name: name,
        value: "" + i
      });
      if (this.mget("disabled")) {
        $input.prop("disabled", true);
      }
      if (i === active) {
        $input.prop("checked", true);
      }
      $label = $('<label></label>').text(label).prepend($input);
      if (this.mget("inline")) {
        $label.addClass("bk-bs-radio-inline");
        this.$el.append($label);
      } else {
        $div = $('<div class="bk-bs-radio"></div>').append($label);
        this.$el.append($div);
      }
    }
    return this;
  };

  RadioGroupView.prototype.change_input = function() {
    var active, i, radio;
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
    return this.mset('active', active[0]);
  };

  return RadioGroupView;

})(BokehView);

RadioGroup = (function(superClass) {
  extend(RadioGroup, superClass);

  function RadioGroup() {
    return RadioGroup.__super__.constructor.apply(this, arguments);
  }

  RadioGroup.prototype.type = "RadioGroup";

  RadioGroup.prototype.default_view = RadioGroupView;

  RadioGroup.prototype.props = function() {
    return _.extend({}, RadioGroup.__super__.props.call(this), {
      active: [p.Any, null],
      labels: [p.Array, []],
      inline: [p.Bool, false]
    });
  };

  return RadioGroup;

})(Widget.Model);

module.exports = {
  Model: RadioGroup,
  View: RadioGroupView
};
