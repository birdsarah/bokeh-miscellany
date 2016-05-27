from bokeh.models import (
    Plot, Range1d, LinearAxis, ColumnDataSource, Row, Column, Title, Circle
)
from bokeh.io import output_file, show

output_file('test_titles.html')

source = ColumnDataSource(data=dict(x=[1, 2], y=[1, 2]))


def make_plot(location, title_align, two_axes=True):
    plot = Plot(
        plot_width=400, plot_height=200,
        x_range=Range1d(0, 2), y_range=Range1d(0, 2), toolbar_location=None,
        title="Title %s - %s" % (location, title_align), title_location=location,
    )
    plot.title.title_align = title_align
    plot.add_glyph(source, Circle(x='x', y='y', radius=0.4))
    plot.add_layout(LinearAxis(), location)
    if two_axes:
        plot.add_layout(LinearAxis(), location)
    return plot

layout = Column(
    make_plot('above', 'left', two_axes=False),  # This is a workaround top doesn't like two axes
    make_plot('right', 'right'),
    make_plot('below', 'center'), # NOTE THIS HAS A BUG!!!
    make_plot('left', 'left')
)

show(layout)
