var $, Annotation, ColumnDataSource, Label, LabelView, Renderer, _, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

$ = require("jquery");

Annotation = require("./annotation");

ColumnDataSource = require("../sources/column_data_source");

Renderer = require("../renderers/renderer");

p = require("../../core/properties");

LabelView = (function(superClass) {
  extend(LabelView, superClass);

  function LabelView() {
    return LabelView.__super__.constructor.apply(this, arguments);
  }

  LabelView.prototype.initialize = function(options) {
    LabelView.__super__.initialize.call(this, options);
    if (this.mget('source') == null) {
      this.mset('source', new ColumnDataSource.Model());
    }
    this.canvas = this.plot_model.get('canvas');
    this.xmapper = this.plot_view.frame.get('x_mappers')[this.mget("x_range_name")];
    this.ymapper = this.plot_view.frame.get('y_mappers')[this.mget("y_range_name")];
    return this.set_data();
  };

  LabelView.prototype.bind_bokeh_events = function() {
    if (this.mget('render_mode') === 'css') {
      this.listenTo(this.model, 'change', this.render);
      return this.listenTo(this.mget('source'), 'change', function() {
        this.set_data();
        return this.render();
      });
    } else {
      this.listenTo(this.model, 'change', this.plot_view.request_render);
      return this.listenTo(this.mget('source'), 'change', function() {
        this.set_data();
        return this.plot_view.request_render();
      });
    }
  };

  LabelView.prototype.set_data = function() {
    LabelView.__super__.set_data.call(this, this.mget('source'));
    return this.set_visuals(this.mget('source'));
  };

  LabelView.prototype._set_data = function() {
    var ctx, i, j, ld, ref, ref1, results;
    this.label_div = (function() {
      var j, len, ref, results;
      ref = this._text;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        i = ref[j];
        results.push($("<div>").addClass('label').hide());
      }
      return results;
    }).call(this);
    this.width = (function() {
      var j, len, ref, results;
      ref = this._text;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        i = ref[j];
        results.push(null);
      }
      return results;
    }).call(this);
    this.height = (function() {
      var j, len, ref, results;
      ref = this._text;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        i = ref[j];
        results.push(null);
      }
      return results;
    }).call(this);
    this.x_shift = (function() {
      var j, len, ref, results;
      ref = this._text;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        i = ref[j];
        results.push(null);
      }
      return results;
    }).call(this);
    this.y_shift = (function() {
      var j, len, ref, results;
      ref = this._text;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        i = ref[j];
        results.push(null);
      }
      return results;
    }).call(this);
    ld = this.mget("border_line_dash");
    if (_.isArray(ld)) {
      if (ld.length < 2) {
        this.line_dash = "solid";
      } else {
        this.line_dash = "dashed";
      }
    }
    if (_.isString(ld)) {
      this.line_dash = ld;
    }
    ctx = this.plot_view.canvas_view.ctx;
    results = [];
    for (i = j = 0, ref = this._text.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      this.visuals.text.set_vectorize(ctx, i);
      this.width[i] = ctx.measureText(this._text[i]).width;
      this.height[i] = ctx.measureText(this._text[i]).ascent / 1.175;
      results.push((ref1 = this._calculate_offset(ctx, this.height[i], this.width[i]), this.x_shift[i] = ref1[0], this.y_shift[i] = ref1[1], ref1));
    }
    return results;
  };

  LabelView.prototype._map_data = function() {
    var sx, sy, vx, vy;
    if (this.mget('x_units') === "data") {
      vx = this.xmapper.v_map_to_target(this._x);
    } else {
      vx = this._x.slice(0);
    }
    sx = this.canvas.v_vx_to_sx(vx);
    if (this.mget('y_units') === "data") {
      vy = this.ymapper.v_map_to_target(this._y);
    } else {
      vy = this._y.slice(0);
    }
    sy = this.canvas.v_vy_to_sy(vy);
    return [sx, sy];
  };

  LabelView.prototype._calculate_offset = function(ctx, height, width) {
    var x_shift, y_shift;
    switch (ctx.textAlign) {
      case 'left':
        x_shift = 0;
        break;
      case 'center':
        x_shift = -width / 2;
        break;
      case 'right':
        x_shift = -width;
    }
    switch (ctx.textBaseline) {
      case 'top':
        y_shift = 0.0;
        break;
      case 'middle':
        y_shift = -0.5 * height;
        break;
      case 'bottom':
        y_shift = -1.0 * height;
        break;
      case 'alphabetic':
        y_shift = -0.8 * height;
        break;
      case 'hanging':
        y_shift = -0.17 * height;
        break;
      case 'ideographic':
        y_shift = -0.83 * height;
    }
    return [x_shift, y_shift];
  };

  LabelView.prototype.render = function() {
    var ref;
    ref = this._map_data(), this.sx = ref[0], this.sy = ref[1];
    if (this.mget('render_mode') === 'canvas') {
      return this._canvas_text();
    } else {
      return this._css_text();
    }
  };

  LabelView.prototype._canvas_text = function() {
    var ctx, i, j, ref, results;
    ctx = this.plot_view.canvas_view.ctx;
    results = [];
    for (i = j = 0, ref = this._text.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      ctx.save();
      ctx.rotate(this.mget('angle'));
      ctx.translate(this.sx[i] + this._x_offset[i], this.sy[i] - this._y_offset[i]);
      ctx.beginPath();
      ctx.rect(this.x_shift[i], this.y_shift[i], this.width[i], this.height[i]);
      if (this.visuals.background_fill.doit) {
        this.visuals.background_fill.set_vectorize(ctx, i);
        ctx.fill();
      }
      if (this.visuals.border_line.doit) {
        this.visuals.border_line.set_vectorize(ctx, i);
        ctx.stroke();
      }
      if (this.visuals.text.doit) {
        this.visuals.text.set_vectorize(ctx, i);
        ctx.fillText(this._text[i], 0, 0);
      }
      results.push(ctx.restore());
    }
    return results;
  };

  LabelView.prototype._css_text = function() {
    var ctx, div_style, i, j, ref, results;
    ctx = this.plot_view.canvas_view.ctx;
    results = [];
    for (i = j = 0, ref = this._text.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      this.visuals.text.set_vectorize(ctx, i);
      this.visuals.border_line.set_vectorize(ctx, i);
      this.visuals.background_fill.set_vectorize(ctx, i);
      if (this.label_div[i].style == null) {
        this.label_div[i].appendTo(this.plot_view.$el.find('div.bk-canvas-overlays'));
      }
      this.label_div[i].hide();
      div_style = {
        'position': 'absolute',
        'top': (this.sy[i] - this._y_offset[i] + this.y_shift[i]) + "px",
        'left': (this.sx[i] + this._x_offset[i] + this.x_shift[i]) + "px",
        'color': "" + this._text_color[i],
        'opacity': "" + this._text_alpha[i],
        'font-size': "" + this._text_font_size[i],
        'font-family': "" + (this.mget('text_font')),
        'background-color': "" + (this.visuals.background_fill.color_value())
      };
      if (this.visuals.background_fill.doit) {
        _.extend(div_style, {
          'background-color': "" + (this.visuals.background_fill.color_value())
        });
      }
      if (this.visuals.border_line.doit) {
        _.extend(div_style, {
          'border-style': "" + this.line_dash,
          'border-width': "" + this._border_line_width[i],
          'border-color': "" + (this.visuals.border_line.color_value())
        });
      }
      results.push(this.label_div[i].html(this._text[i]).css(div_style).show());
    }
    return results;
  };

  return LabelView;

})(Renderer.View);

Label = (function(superClass) {
  extend(Label, superClass);

  function Label() {
    return Label.__super__.constructor.apply(this, arguments);
  }

  Label.prototype.default_view = LabelView;

  Label.prototype.type = 'Label';

  Label.mixins(['text', 'line:border_', 'fill:background_']);

  Label.define({
    x: [p.NumberSpec],
    x_units: [p.SpatialUnits, 'data'],
    y: [p.NumberSpec],
    y_units: [p.SpatialUnits, 'data'],
    text: [
      p.StringSpec, {
        field: "text"
      }
    ],
    angle: [p.AngleSpec, 0],
    x_offset: [
      p.NumberSpec, {
        value: 0
      }
    ],
    y_offset: [
      p.NumberSpec, {
        value: 0
      }
    ],
    source: [p.Instance],
    x_range_name: [p.String, 'default'],
    y_range_name: [p.String, 'default'],
    render_mode: [p.RenderMode, 'canvas']
  });

  Label.prototype.defaults = function() {
    return _.extend({}, Label.__super__.defaults.call(this), {
      background_fill_color: null,
      border_line_color: null
    });
  };

  return Label;

})(Annotation.Model);

module.exports = {
  Model: Label,
  View: LabelView
};
