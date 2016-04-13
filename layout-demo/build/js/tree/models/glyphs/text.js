var Glyph, Text, TextView, _, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

Glyph = require("./glyph");

p = require("../../core/properties");

TextView = (function(superClass) {
  extend(TextView, superClass);

  function TextView() {
    return TextView.__super__.constructor.apply(this, arguments);
  }

  TextView.prototype._index_data = function() {
    return this._xy_index();
  };

  TextView.prototype._render = function(ctx, indices, arg) {
    var angle, i, j, len, results, sx, sy, text, x_offset, y_offset;
    sx = arg.sx, sy = arg.sy, x_offset = arg.x_offset, y_offset = arg.y_offset, angle = arg.angle, text = arg.text;
    results = [];
    for (j = 0, len = indices.length; j < len; j++) {
      i = indices[j];
      if (isNaN(sx[i] + sy[i] + x_offset[i] + y_offset[i] + angle[i]) || (text[i] == null)) {
        continue;
      }
      ctx.save();
      ctx.translate(sx[i] + x_offset[i], sy[i] + y_offset[i]);
      ctx.rotate(angle[i]);
      this.visuals.text.set_vectorize(ctx, i);
      ctx.fillText(text[i], 0, 0);
      results.push(ctx.restore());
    }
    return results;
  };

  TextView.prototype.draw_legend = function(ctx, x1, x2, y1, y2) {
    ctx.save();
    this.text_props.set_value(ctx);
    ctx.font = this.text_props.font_value();
    ctx.font = ctx.font.replace(/\b[\d\.]+[\w]+\b/, '10pt');
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText("text", x2, (y1 + y2) / 2);
    return ctx.restore();
  };

  return TextView;

})(Glyph.View);

Text = (function(superClass) {
  extend(Text, superClass);

  function Text() {
    return Text.__super__.constructor.apply(this, arguments);
  }

  Text.prototype.default_view = TextView;

  Text.prototype.type = 'Text';

  Text.prototype.mixins = ['text'];

  Text.prototype.props = function() {
    return _.extend({}, Text.__super__.props.call(this), {
      text: [
        p.StringSpec, {
          field: "text"
        }
      ],
      angle: [p.AngleSpec, 0],
      x_offset: [p.NumberSpec, 0],
      y_offset: [p.NumberSpec, 0]
    });
  };

  return Text;

})(Glyph.Model);

module.exports = {
  Model: Text,
  View: TextView
};
