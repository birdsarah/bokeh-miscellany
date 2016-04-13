var Annotation, Legend, LegendView, Renderer, _, get_text_height, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

Annotation = require("./annotation");

Renderer = require("../renderers/renderer");

p = require("../../core/properties");

get_text_height = require("../../core/util/text").get_text_height;

LegendView = (function(superClass) {
  extend(LegendView, superClass);

  function LegendView() {
    return LegendView.__super__.constructor.apply(this, arguments);
  }

  LegendView.prototype.initialize = function(options) {
    LegendView.__super__.initialize.call(this, options);
    this.need_calc_dims = true;
    return this.listenTo(this.plot_model.solver, 'layout_update', function() {
      return this.need_calc_dims = true;
    });
  };

  LegendView.prototype.calc_dims = function(options) {
    var ctx, glyph_height, glyph_width, glyphs, h_range, i, label_height, label_width, legend_name, legend_names, legend_padding, legend_spacing, len, location, max_label_width, name, ref, v_range, width, x, y;
    legend_names = (function() {
      var i, len, ref, ref1, results;
      ref = this.mget("legends");
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        ref1 = ref[i], legend_name = ref1[0], glyphs = ref1[1];
        results.push(legend_name);
      }
      return results;
    }).call(this);
    glyph_height = this.mget('glyph_height');
    glyph_width = this.mget('glyph_width');
    label_height = this.mget('label_height');
    label_width = this.mget('label_width');
    legend_spacing = this.mget('legend_spacing');
    this.max_label_height = _.max([get_text_height(this.visuals.label_text.font_value()), label_height, glyph_height]);
    ctx = this.plot_view.canvas_view.ctx;
    ctx.save();
    this.visuals.label_text.set_value(ctx);
    this.text_widths = {};
    for (i = 0, len = legend_names.length; i < len; i++) {
      name = legend_names[i];
      this.text_widths[name] = _.max([ctx.measureText(name).width, label_width]);
    }
    ctx.restore();
    max_label_width = _.max(_.values(this.text_widths));
    if (this.mget("orientation") === "vertical") {
      this.legend_height = legend_names.length * this.max_label_height + (1 + legend_names.length) * legend_spacing;
      this.legend_width = max_label_width + glyph_width + 3 * legend_spacing;
    } else {
      this.legend_width = 0;
      ref = this.text_widths;
      for (name in ref) {
        width = ref[name];
        this.legend_width += _.max([width, label_width]) + glyph_width + 3 * legend_spacing;
      }
      this.legend_height = this.max_label_height + 2 * legend_spacing;
    }
    location = this.mget('location');
    legend_padding = this.mget('legend_padding');
    h_range = this.plot_view.frame.get('h_range');
    v_range = this.plot_view.frame.get('v_range');
    if (_.isString(location)) {
      switch (location) {
        case 'top_left':
          x = h_range.get('start') + legend_padding;
          y = v_range.get('end') - legend_padding;
          break;
        case 'top_center':
          x = (h_range.get('end') + h_range.get('start')) / 2 - this.legend_width / 2;
          y = v_range.get('end') - legend_padding;
          break;
        case 'top_right':
          x = h_range.get('end') - legend_padding - this.legend_width;
          y = v_range.get('end') - legend_padding;
          break;
        case 'right_center':
          x = h_range.get('end') - legend_padding - this.legend_width;
          y = (v_range.get('end') + v_range.get('start')) / 2 + this.legend_height / 2;
          break;
        case 'bottom_right':
          x = h_range.get('end') - legend_padding - this.legend_width;
          y = v_range.get('start') + legend_padding + this.legend_height;
          break;
        case 'bottom_center':
          x = (h_range.get('end') + h_range.get('start')) / 2 - this.legend_width / 2;
          y = v_range.get('start') + legend_padding + this.legend_height;
          break;
        case 'bottom_left':
          x = h_range.get('start') + legend_padding;
          y = v_range.get('start') + legend_padding + this.legend_height;
          break;
        case 'left_center':
          x = h_range.get('start') + legend_padding;
          y = (v_range.get('end') + v_range.get('start')) / 2 + this.legend_height / 2;
          break;
        case 'center':
          x = (h_range.get('end') + h_range.get('start')) / 2 - this.legend_width / 2;
          y = (v_range.get('end') + v_range.get('start')) / 2 + this.legend_height / 2;
      }
    } else if (_.isArray(location) && location.length === 2) {
      x = location[0], y = location[1];
    }
    x = this.plot_view.canvas.vx_to_sx(x);
    y = this.plot_view.canvas.vy_to_sy(y);
    return this.box_coords = [x, y];
  };

  LegendView.prototype.render = function() {
    var N, ctx, glyph_height, glyph_width, glyphs, i, idx, j, legend_name, legend_spacing, len, len1, orientation, ref, ref1, renderer, tx, ty, view, x1, x2, xoffset, y1, y2, yoffset;
    if (this.need_calc_dims) {
      this.calc_dims();
      this.need_calc_dims = false;
    }
    glyph_height = this.mget('glyph_height');
    glyph_width = this.mget('glyph_width');
    orientation = this.mget('orientation');
    ctx = this.plot_view.canvas_view.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.rect(this.box_coords[0], this.box_coords[1], this.legend_width, this.legend_height);
    this.visuals.background_fill.set_value(ctx);
    ctx.fill();
    if (this.visuals.border_line.doit) {
      this.visuals.border_line.set_value(ctx);
      ctx.stroke();
    }
    legend_spacing = this.mget('legend_spacing');
    N = this.mget("legends").length;
    xoffset = 0;
    ref = this.mget("legends");
    for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
      ref1 = ref[idx], legend_name = ref1[0], glyphs = ref1[1];
      if (orientation === "vertical") {
        yoffset = idx * this.legend_height / N;
        x1 = this.box_coords[0] + legend_spacing;
        x2 = x1 + glyph_width;
        y1 = this.box_coords[1] + yoffset + legend_spacing;
        y2 = y1 + glyph_height;
      } else {
        x1 = this.box_coords[0] + xoffset + legend_spacing;
        x2 = x1 + glyph_width;
        y1 = this.box_coords[1] + legend_spacing;
        y2 = y1 + glyph_height;
        xoffset += this.text_widths[legend_name] + 3 * legend_spacing + glyph_width;
      }
      tx = x2 + legend_spacing;
      ty = y1 + this.max_label_height / 2.0;
      this.visuals.label_text.set_value(ctx);
      ctx.fillText(legend_name, tx, ty);
      for (j = 0, len1 = glyphs.length; j < len1; j++) {
        renderer = glyphs[j];
        view = this.plot_view.renderers[renderer.id];
        view.draw_legend(ctx, x1, x2, y1, y2);
      }
    }
    return ctx.restore();
  };

  return LegendView;

})(Renderer.View);

Legend = (function(superClass) {
  extend(Legend, superClass);

  function Legend() {
    return Legend.__super__.constructor.apply(this, arguments);
  }

  Legend.prototype.default_view = LegendView;

  Legend.prototype.type = 'Legend';

  Legend.prototype.mixins = ['text:label_', 'line:border_', 'fill:background_'];

  Legend.prototype.props = function() {
    return _.extend({}, Legend.__super__.props.call(this), {
      legends: [p.Array, []],
      orientation: [p.Orientation, 'vertical'],
      location: [p.Any, 'top_right'],
      label_standoff: [p.Number, 15],
      glyph_height: [p.Number, 20],
      glyph_width: [p.Number, 20],
      label_height: [p.Number, 20],
      label_width: [p.Number, 50],
      legend_padding: [p.Number, 10],
      legend_spacing: [p.Number, 3]
    });
  };

  Legend.prototype.defaults = function() {
    return _.extend({}, Legend.__super__.defaults.call(this), {
      border_line_color: 'black',
      background_fill_color: "#ffffff",
      label_text_font_size: "10pt",
      label_text_baseline: "middle"
    });
  };

  return Legend;

})(Annotation.Model);

module.exports = {
  Model: Legend,
  View: LegendView
};
