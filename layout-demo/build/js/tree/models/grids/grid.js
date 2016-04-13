var Grid, GridView, GuideRenderer, Renderer, _, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

GuideRenderer = require("../renderers/guide_renderer");

Renderer = require("../renderers/renderer");

p = require("../../core/properties");

GridView = (function(superClass) {
  extend(GridView, superClass);

  function GridView() {
    return GridView.__super__.constructor.apply(this, arguments);
  }

  GridView.prototype.initialize = function(attrs, options) {
    GridView.__super__.initialize.call(this, attrs, options);
    this.x_range_name = this.mget('x_range_name');
    return this.y_range_name = this.mget('y_range_name');
  };

  GridView.prototype.render = function() {
    var ctx;
    ctx = this.plot_view.canvas_view.ctx;
    ctx.save();
    this._draw_regions(ctx);
    this._draw_minor_grids(ctx);
    this._draw_grids(ctx);
    return ctx.restore();
  };

  GridView.prototype.bind_bokeh_events = function() {
    return this.listenTo(this.model, 'change', this.request_render);
  };

  GridView.prototype._draw_regions = function(ctx) {
    var i, k, ref, ref1, ref2, ref3, sx0, sx1, sy0, sy1, xs, ys;
    if (!this.visuals.band_fill.doit) {
      return;
    }
    ref = this.mget('grid_coords'), xs = ref[0], ys = ref[1];
    this.visuals.band_fill.set_value(ctx);
    for (i = k = 0, ref1 = xs.length - 1; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
      if (i % 2 === 1) {
        ref2 = this.plot_view.map_to_screen(xs[i], ys[i], this.x_range_name, this.y_range_name), sx0 = ref2[0], sy0 = ref2[1];
        ref3 = this.plot_view.map_to_screen(xs[i + 1], ys[i + 1], this.x_range_name, this.y_range_name), sx1 = ref3[0], sy1 = ref3[1];
        ctx.fillRect(sx0[0], sy0[0], sx1[1] - sx0[0], sy1[1] - sy0[0]);
        ctx.fill();
      }
    }
  };

  GridView.prototype._draw_grids = function(ctx) {
    var ref, xs, ys;
    if (!this.visuals.grid_line.doit) {
      return;
    }
    ref = this.mget('grid_coords'), xs = ref[0], ys = ref[1];
    return this._draw_grid_helper(ctx, this.visuals.grid_line, xs, ys);
  };

  GridView.prototype._draw_minor_grids = function(ctx) {
    var ref, xs, ys;
    if (!this.visuals.minor_grid_line.doit) {
      return;
    }
    ref = this.mget('minor_grid_coords'), xs = ref[0], ys = ref[1];
    return this._draw_grid_helper(ctx, this.visuals.minor_grid_line, xs, ys);
  };

  GridView.prototype._draw_grid_helper = function(ctx, props, xs, ys) {
    var i, k, l, ref, ref1, ref2, sx, sy;
    props.set_value(ctx);
    for (i = k = 0, ref = xs.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      ref1 = this.plot_view.map_to_screen(xs[i], ys[i], this.x_range_name, this.y_range_name), sx = ref1[0], sy = ref1[1];
      ctx.beginPath();
      ctx.moveTo(Math.round(sx[0]), Math.round(sy[0]));
      for (i = l = 1, ref2 = sx.length; 1 <= ref2 ? l < ref2 : l > ref2; i = 1 <= ref2 ? ++l : --l) {
        ctx.lineTo(Math.round(sx[i]), Math.round(sy[i]));
      }
      ctx.stroke();
    }
  };

  return GridView;

})(Renderer.View);

Grid = (function(superClass) {
  extend(Grid, superClass);

  function Grid() {
    return Grid.__super__.constructor.apply(this, arguments);
  }

  Grid.prototype.default_view = GridView;

  Grid.prototype.type = 'Grid';

  Grid.prototype.mixins = ['line:grid_', 'line:minor_grid_', 'fill:band_'];

  Grid.prototype.props = function() {
    return _.extend({}, Grid.__super__.props.call(this), {
      bounds: [p.Any, 'auto'],
      dimension: [p.Number, 0],
      ticker: [p.Instance],
      x_range_name: [p.String, 'default'],
      y_range_name: [p.String, 'default']
    });
  };

  Grid.prototype.defaults = function() {
    return _.extend({}, Grid.__super__.defaults.call(this), {
      level: "underlay",
      band_fill_color: null,
      band_fill_alpha: 0,
      grid_line_color: '#cccccc',
      minor_grid_line_color: null
    });
  };

  Grid.prototype.initialize = function(attrs, options) {
    Grid.__super__.initialize.call(this, attrs, options);
    this.register_property('computed_bounds', this._bounds, false);
    this.add_dependencies('computed_bounds', this, ['bounds']);
    this.register_property('grid_coords', this._grid_coords, false);
    this.add_dependencies('grid_coords', this, ['computed_bounds', 'dimension', 'ticker']);
    this.register_property('minor_grid_coords', this._minor_grid_coords, false);
    this.add_dependencies('minor_grid_coords', this, ['computed_bounds', 'dimension', 'ticker']);
    return this.register_property('ranges', this._ranges, true);
  };

  Grid.prototype._ranges = function() {
    var frame, i, j, ranges;
    i = this.get('dimension');
    j = (i + 1) % 2;
    frame = this.get('plot').get('frame');
    ranges = [frame.get('x_ranges')[this.get('x_range_name')], frame.get('y_ranges')[this.get('y_range_name')]];
    return [ranges[i], ranges[j]];
  };

  Grid.prototype._bounds = function() {
    var cross_range, end, range, range_bounds, ref, start, user_bounds;
    ref = this.get('ranges'), range = ref[0], cross_range = ref[1];
    user_bounds = this.get('bounds');
    range_bounds = [range.get('min'), range.get('max')];
    if (_.isArray(user_bounds)) {
      start = Math.min(user_bounds[0], user_bounds[1]);
      end = Math.max(user_bounds[0], user_bounds[1]);
      if (start < range_bounds[0]) {
        start = range_bounds[0];
      } else if (start > range_bounds[1]) {
        start = null;
      }
      if (end > range_bounds[1]) {
        end = range_bounds[1];
      } else if (end < range_bounds[0]) {
        end = null;
      }
    } else {
      start = range_bounds[0], end = range_bounds[1];
    }
    return [start, end];
  };

  Grid.prototype._grid_coords = function() {
    return this._grid_coords_helper('major');
  };

  Grid.prototype._minor_grid_coords = function() {
    return this._grid_coords_helper('minor');
  };

  Grid.prototype._grid_coords_helper = function(location) {
    var N, cmax, cmin, coords, cross_range, dim_i, dim_j, end, i, ii, j, k, l, loc, max, min, n, range, ref, ref1, ref2, ref3, start, ticks, tmp;
    i = this.get('dimension');
    j = (i + 1) % 2;
    ref = this.get('ranges'), range = ref[0], cross_range = ref[1];
    ref1 = this.get('computed_bounds'), start = ref1[0], end = ref1[1];
    tmp = Math.min(start, end);
    end = Math.max(start, end);
    start = tmp;
    ticks = this.get('ticker').get_ticks(start, end, range, {})[location];
    min = range.get('min');
    max = range.get('max');
    cmin = cross_range.get('min');
    cmax = cross_range.get('max');
    coords = [[], []];
    for (ii = k = 0, ref2 = ticks.length; 0 <= ref2 ? k < ref2 : k > ref2; ii = 0 <= ref2 ? ++k : --k) {
      if (ticks[ii] === min || ticks[ii] === max) {
        continue;
      }
      dim_i = [];
      dim_j = [];
      N = 2;
      for (n = l = 0, ref3 = N; 0 <= ref3 ? l < ref3 : l > ref3; n = 0 <= ref3 ? ++l : --l) {
        loc = cmin + (cmax - cmin) / (N - 1) * n;
        dim_i.push(ticks[ii]);
        dim_j.push(loc);
      }
      coords[i].push(dim_i);
      coords[j].push(dim_j);
    }
    return coords;
  };

  return Grid;

})(GuideRenderer.Model);

module.exports = {
  Model: Grid,
  View: GridView
};
