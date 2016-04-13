var BokehView, Canvas, CanvasView, EQ, LayoutBox, _, canvas_template, fixup_image_smoothing, fixup_line_dash, fixup_line_dash_offset, fixup_measure_text, get_scale_ratio, logger, ref,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

canvas_template = require("./canvas_template");

LayoutBox = require("./layout_box");

BokehView = require("../../core/bokeh_view");

EQ = require("../../core/layout/solver").EQ;

logger = require("../../core/logging").logger;

ref = require("../../core/util/canvas"), fixup_image_smoothing = ref.fixup_image_smoothing, fixup_line_dash = ref.fixup_line_dash, fixup_line_dash_offset = ref.fixup_line_dash_offset, fixup_measure_text = ref.fixup_measure_text, get_scale_ratio = ref.get_scale_ratio;

CanvasView = (function(superClass) {
  extend(CanvasView, superClass);

  function CanvasView() {
    return CanvasView.__super__.constructor.apply(this, arguments);
  }

  CanvasView.prototype.className = "bk-canvas-wrapper";

  CanvasView.prototype.template = canvas_template;

  CanvasView.prototype.initialize = function(options) {
    var html, ref1;
    CanvasView.__super__.initialize.call(this, options);
    html = this.template({
      map: this.mget('map')
    });
    this.$el.html(html);
    this.canvas = this.$('canvas.bk-canvas');
    this.ctx = this.canvas[0].getContext('2d');
    this.ctx.glcanvas = null;
    fixup_line_dash(this.ctx);
    fixup_line_dash_offset(this.ctx);
    fixup_image_smoothing(this.ctx);
    fixup_measure_text(this.ctx);
    this.map_div = (ref1 = this.$('div.bk-canvas-map')) != null ? ref1 : null;
    return logger.debug("CanvasView initialized");
  };

  CanvasView.prototype.render = function(force) {
    var height, ratio, width;
    if (force == null) {
      force = false;
    }
    width = this.mget('width');
    height = this.mget('height');
    if (!_.isEqual(this.last_dims, [width, height]) || force) {
      ratio = get_scale_ratio(this.ctx, this.mget('use_hidpi'));
      logger.debug("Rendering CanvasView [force=" + force + "] with width: " + width + ", height: " + height + ", ratio: " + ratio);
      this.canvas.attr('style', "width:" + width + "px; height:" + height + "px");
      this.canvas.attr('width', width * ratio).attr('height', height * ratio);
      this.$el.attr('style', "z-index: 50; width:" + width + "px; height:" + height + "px");
      this.$el.attr("width", width).attr('height', height);
      this.$('div.bk-canvas-overlays').attr('style', "z-index:75; position:absolute; top:0; left:0; width:" + width + "px; height:" + height + "px;");
      this.$('div.bk-canvas-events').attr('style', "z-index:100; position:absolute; top:0; left:0; width:" + width + "px; height:" + height + "px;");
      this.ctx.scale(ratio, ratio);
      this.ctx.translate(0.5, 0.5);
      this.last_dims = [width, height];
    }
  };

  return CanvasView;

})(BokehView);

Canvas = (function(superClass) {
  extend(Canvas, superClass);

  function Canvas() {
    return Canvas.__super__.constructor.apply(this, arguments);
  }

  Canvas.prototype.type = 'Canvas';

  Canvas.prototype.default_view = CanvasView;

  Canvas.prototype.defaults = function() {
    return _.extend({}, Canvas.__super__.defaults.call(this), {
      map: false,
      use_hidpi: true
    });
  };

  Canvas.prototype.initialize = function(attrs, options) {
    Canvas.__super__.initialize.call(this, attrs, options);
    return this.panel = this;
  };

  Canvas.prototype.set_dims = function(dims, trigger) {
    if (trigger == null) {
      trigger = true;
    }
    this._set_width(dims[0]);
    this._set_height(dims[1]);
    this.document.solver().update_variables(trigger);
  };

  Canvas.prototype._doc_attached = function() {
    var solver;
    Canvas.__super__._doc_attached.call(this);
    solver = this.document.solver();
    solver.add_constraint(EQ(this._left));
    solver.add_constraint(EQ(this._bottom));
    this.set_dims([this.get('canvas_width'), this.get('canvas_height')]);
    return logger.debug("Canvas attached to document");
  };

  Canvas.prototype.vx_to_sx = function(x) {
    return x;
  };

  Canvas.prototype.vy_to_sy = function(y) {
    return this.get('height') - (y + 1);
  };

  Canvas.prototype.v_vx_to_sx = function(xx) {
    var i, idx, len, x;
    for (idx = i = 0, len = xx.length; i < len; idx = ++i) {
      x = xx[idx];
      xx[idx] = x;
    }
    return xx;
  };

  Canvas.prototype.v_vy_to_sy = function(yy) {
    var canvas_height, i, idx, len, y;
    canvas_height = this.get('height');
    for (idx = i = 0, len = yy.length; i < len; idx = ++i) {
      y = yy[idx];
      yy[idx] = canvas_height - (y + 1);
    }
    return yy;
  };

  Canvas.prototype.sx_to_vx = function(x) {
    return x;
  };

  Canvas.prototype.sy_to_vy = function(y) {
    return this.get('height') - (y + 1);
  };

  Canvas.prototype.v_sx_to_vx = function(xx) {
    var i, idx, len, x;
    for (idx = i = 0, len = xx.length; i < len; idx = ++i) {
      x = xx[idx];
      xx[idx] = x;
    }
    return xx;
  };

  Canvas.prototype.v_sy_to_vy = function(yy) {
    var canvas_height, i, idx, len, y;
    canvas_height = this.get('height');
    for (idx = i = 0, len = yy.length; i < len; idx = ++i) {
      y = yy[idx];
      yy[idx] = canvas_height - (y + 1);
    }
    return yy;
  };

  Canvas.prototype._set_width = function(width) {
    var solver;
    solver = this.document.solver();
    if (this._width_constraint != null) {
      solver.remove_constraint(this._width_constraint);
    }
    this._width_constraint = EQ(this._width, -width);
    solver.add_constraint(this._width_constraint);
    solver.update_variables();
  };

  Canvas.prototype._set_height = function(height) {
    var solver;
    solver = this.document.solver();
    if (this._height_constraint != null) {
      solver.remove_constraint(this._height_constraint);
    }
    this._height_constraint = EQ(this._height, -height);
    solver.add_constraint(this._height_constraint);
    solver.update_variables();
  };

  Canvas.prototype._set_dims = function(dims, trigger) {
    if (trigger == null) {
      trigger = true;
    }
    logger.warn("_set_dims is deprecated, use set_dims");
    this.set_dims(dims, trigger);
  };

  return Canvas;

})(LayoutBox.Model);

module.exports = {
  Model: Canvas
};
