# coding: utf-8
import pandas as pd

from contextlib import contextmanager
from bokeh.io import vplot, output_file, show
from bokeh.models import (
    Plot, Patch, Patches, Line, MultiLine,
    ColumnDataSource, Range1d, LinearAxis,
    HoverTool, WheelZoomTool
)
from bokeh.palettes import Spectral3, Spectral4
from numpy import NAN

output_file('scrolling.html', mode='relative-dev')

patch_data = ColumnDataSource(pd.DataFrame(
    {
        'oil'  : [1, 2, 3, 1],
        'gas'  : [3, 2, 2, 3],
        'solar': [0, 1, 1, 1]
    },
    index = [2010, 2011, 2012, 2013]
))
patches_data = ColumnDataSource(pd.DataFrame(
    {
        'xs'  : [[1, 2, 3, 1], [2, 4, 6, 2], [3, 6, 9, 3], [1, -1, -2, 0] ],
        'ys'  : [[0, 1, 5, -1], [8, -3, 4, 0], [3, 4, 5, 4], [1, 4, 0, 2]],
        'value': [Spectral4[0], Spectral4[1], Spectral4[2], Spectral4[3]]
    },
))
patch_with_hole_data = ColumnDataSource(pd.DataFrame(
    {
        'oil'  : [1, 2, 1, NAN, 3, 1, 2, 1],
        'gas'  : [3, 2, 2, NAN, 2, 3, 4, 1],
        'solar': [0, 1, 3, 2, NAN, 1, 4, 5]
    },
    index = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017]
))
patches_with_hole_data = ColumnDataSource(pd.DataFrame(
    {
        'xs'  : [[1, 2, 3, NAN, 3, 1, 2], [2, 4, 5, NAN, 6, 2, 1], [3, 6, 8, NAN, 9, 3, 4], [1, -1, 2, NAN, 2, -2, 0] ],
        'ys'  : [[0, 1, -1, NAN, 5, -1, -2], [8, -3, 5, NAN, 4, 0, 1], [3, 4, 2, NAN, 5, 4, 6], [1, 4, 6, NAN, 1, 0, 2] ],
        'value': [Spectral4[0], Spectral4[1], Spectral4[2], Spectral4[3]]
    },
))

PLOT_PROPS = dict(plot_width=2000, plot_height=300, min_border=0, toolbar_location=None, title=None)


@contextmanager
def make_plot(x_range, y_range, source):
    plot = Plot(x_range=x_range, y_range=y_range, **PLOT_PROPS)
    yield plot
    plot.add_tools(WheelZoomTool())


def make_patch_plot(x_range, y_range, source):
    with make_plot(x_range, y_range, source) as plot:
        for i, energy in enumerate(['gas', 'oil', 'solar']):
            glyph = Patch(x='index', y=energy, fill_color=Spectral3[i], fill_alpha=0.5, line_color='#CCCCCC', line_alpha=0.5)
            plot.add_glyph(source, glyph)
    return plot


def make_line_plot(x_range, y_range, source):
    with make_plot(x_range, y_range, source) as plot:
        for i, energy in enumerate(['gas', 'oil', 'solar']):
            glyph = Line(x='index', y=energy, line_color=Spectral3[i], line_alpha=0.5, line_width=5)
            plot.add_glyph(source, glyph)
    return plot


def make_patches_plot(x_range, y_range, source):
    with make_plot(x_range, y_range, source) as plot:
        glyph = Patches(xs='xs', ys='ys', fill_color='value', fill_alpha=0.8, line_color='#CCCCCC', line_alpha=0.8)
        plot.add_glyph(source, glyph)
    return plot


def make_multiline_plot(x_range, y_range, source):
    with make_plot(x_range, y_range, source) as plot:
        glyph = MultiLine(xs='xs', ys='ys', line_color='value', line_width=5, line_alpha=0.8)
        plot.add_glyph(source, glyph)
    return plot

patch = make_patch_plot(Range1d(2010, 2013), Range1d(0, 5), patch_data)
line = make_line_plot(Range1d(2010, 2013), Range1d(0, 5), patch_data)

patches = make_patches_plot(Range1d(-5, 10), Range1d(-5, 10), patches_data)
multiline = make_multiline_plot(Range1d(-5, 10), Range1d(-5, 10), patches_data)

patch_with_hole = make_patch_plot(Range1d(2010, 2017), Range1d(0, 5), patch_with_hole_data)
line_with_hole = make_line_plot(Range1d(2010, 2016), Range1d(0, 5), patch_with_hole_data)

patches_with_hole = make_patches_plot(Range1d(-5, 10), Range1d(-5, 10), patches_with_hole_data)
multiline_with_hole = make_multiline_plot(Range1d(-5, 10), Range1d(-5, 10), patches_with_hole_data)

show(vplot(
    patch, line, patches, multiline,
    patches_with_hole, line_with_hole, patches_with_hole, multiline_with_hole
))
