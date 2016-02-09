import pandas as pd
from numpy import NAN

from bokeh.browserlib import view
from bokeh.models import Plot, Range1d, ColumnDataSource, Patches, HoverTool, TapTool
from bokeh.properties import value
from bokeh.io import save, output_file

PLOT_FORMATS = dict(x_range=Range1d(0,100), y_range=Range1d(0,100), plot_width=500, plot_height=300, min_border=0, title="Hover and tap discontinuous patches.")

patches_dis_data = pd.DataFrame(
    {
        'xs': [[0, 49, 49, 0, NAN, 51, 89, 89, 51], [90, 100, 100, 90], [92, 98, 98, 92]],
        'ys': [[0, 0, 80, 80, NAN, 0, 0, 90, 90], [0, 0, 100, 100], [20, 20, 90, 90]],
        'value': ['I am one object split in two', 'I am wheat', 'I am steelblue'],
        'fill_color': ['firebrick', 'wheat', 'steelblue']
    },
)
plot_patches_dis = Plot(**PLOT_FORMATS)
plot_patches_dis.add_glyph(
    ColumnDataSource(patches_dis_data),
    Patches(
        xs='xs', ys='ys',
        fill_color='fill_color',
        line_color=value('wheat'),
    )
)
plot_patches_dis.add_tools(HoverTool(tooltips='@value'))
plot_patches_dis.add_tools(TapTool())

filename = '2376_hover_on_discontinuous_patches.html'
output_file(filename, title='Discontinuous Patches', mode='relative-dev')
save(plot_patches_dis)
view(filename)
