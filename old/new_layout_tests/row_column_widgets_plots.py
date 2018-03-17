from __future__ import print_function

from numpy import pi, sin, cos, linspace, tan  # noqa

from bokeh.util.browser import view
from bokeh.document import Document
from bokeh.embed import file_html
from bokeh.layouts import layout, gridplot, row, column, widgetbox
from bokeh.models.glyphs import Line
from bokeh.models import (
    Plot, DataRange1d, LinearAxis, ColumnDataSource, Row, Column, PanTool,
    Slider, Dropdown, Button, HoverTool, CrosshairTool, Toolbar, ToolbarBox,
    BoxSelectTool, CrosshairTool, ResetTool, WidgetBox, Line
)
from bokeh.resources import INLINE

from row_column_widgets import make_widgets

x = linspace(-2 * pi, 2 * pi, 1000)
source = ColumnDataSource(data=dict(
    x=x,
    y1=sin(x),
    y2=cos(x),
    y3=tan(x),
    y4=sin(x) * cos(x),
))


def make_plot(sizing_mode):
    plot = Plot(
        x_range=DataRange1d(),
        y_range=DataRange1d(),
        toolbar_location=None,
        sizing_mode=sizing_mode
    )
    plot.add_glyph(source, Line(x="x", y="y1"))
    plot.add_layout(LinearAxis(), 'below')
    plot.add_layout(LinearAxis(), 'left')
    return plot


def make_wb(sizing_mode):
    w1 = make_widgets(sizing_mode)
    wb = WidgetBox(
        children=[w1['oscars'], w1['genre'], w1['director'], w1['x_axis'], w1['y_axis']],
        sizing_mode=sizing_mode,
        width=400,
    )
    return wb

sizing_mode = 'fixed'

plot = make_plot(sizing_mode)
wb = make_wb(sizing_mode)
w1 = make_widgets(sizing_mode)
wb2 = make_wb(sizing_mode)

#layout = Row(wb, wb2, sizing_mode=sizing_mode)
layout = layout([[make_wb(sizing_mode), make_wb(sizing_mode)], [make_wb(sizing_mode), make_wb(sizing_mode)]], sizing_mode=sizing_mode)

doc = Document()
doc.add_root(layout)

if __name__ == "__main__":
    filename = "row_column_widgets_plots.html"
    with open(filename, "w") as f:
        f.write(file_html(doc, INLINE, "Widgets and plots in rows and columns."))
    print("Wrote %s" % filename)
    view(filename)
