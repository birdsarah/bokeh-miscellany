var Paragraph, PreText, PreTextView, _, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

Paragraph = require("./paragraph");

p = require("../../core/properties");

PreTextView = (function(superClass) {
  extend(PreTextView, superClass);

  function PreTextView() {
    return PreTextView.__super__.constructor.apply(this, arguments);
  }

  PreTextView.prototype.tagName = "pre";

  PreTextView.prototype.attributes = {
    style: "overflow:scroll"
  };

  return PreTextView;

})(Paragraph.View);

PreText = (function(superClass) {
  extend(PreText, superClass);

  function PreText() {
    return PreText.__super__.constructor.apply(this, arguments);
  }

  PreText.prototype.type = "PreText";

  PreText.prototype.default_view = PreTextView;

  PreText.prototype.props = function() {
    return _.extend({}, PreText.__super__.props.call(this), {
      height: [p.Number, 400],
      width: [p.Number, 500]
    });
  };

  return PreText;

})(Paragraph.Model);

module.exports = {
  Model: PreText,
  View: PreTextView
};
