var GuideRenderer, Renderer, _, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

Renderer = require("./renderer");

p = require("../../core/properties");

GuideRenderer = (function(superClass) {
  extend(GuideRenderer, superClass);

  function GuideRenderer() {
    return GuideRenderer.__super__.constructor.apply(this, arguments);
  }

  GuideRenderer.prototype.type = 'GuideRenderer';

  GuideRenderer.prototype.props = function() {
    return _.extend({}, GuideRenderer.__super__.props.call(this), {
      level: [p.RenderLevel, 'overlay'],
      plot: [p.Instance]
    });
  };

  return GuideRenderer;

})(Renderer.Model);

module.exports = {
  Model: GuideRenderer
};
