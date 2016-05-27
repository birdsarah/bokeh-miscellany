from __future__ import print_function

from numpy import pi, sin, cos, linspace, tan  # noqa

from bokeh.util.browser import view
from bokeh.document import Document
from bokeh.embed import file_html
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


def make_plot(responsive):
    plot = Plot(
        x_range=DataRange1d(),
        y_range=DataRange1d(),
        toolbar_location=None,
        responsive=responsive
    )
    plot.add_glyph(source, Line(x="x", y="y1"))
    plot.add_layout(LinearAxis(), 'below')
    plot.add_layout(LinearAxis(), 'left')
    return plot


def make_wb(responsive):
    w1 = make_widgets()
    wb = WidgetBox(
        children=[w1['oscars'], w1['genre'], w1['director'], w1['x_axis'], w1['y_axis']],
        responsive=responsive,
    )
    return wb

responsive = 'fixed'

plot = make_plot(responsive)
wb = make_wb(responsive)
w1 = make_widgets(responsive)

layout = Row(wb, plot, responsive=responsive)

doc = Document()
doc.add_root(layout)

if __name__ == "__main__":
    filename = "row_column_widgets_plots.html"
    with open(filename, "w") as f:
        f.write(file_html(doc, INLINE, "Widgets and plots in rows and columns."))
    print("Wrote %s" % filename)
    view(filename)
