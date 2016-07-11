import numpy as np

from bokeh.plotting import figure, show, output_file
from bokeh.models import GridPlot, ToolbarBox, Column, Row
output_file("color_scatter.html", title="color_scatter.py example")

N = 400
x = np.random.random(size=N) * 100
y = np.random.random(size=N) * 100
radii = np.random.random(size=N) * 1.5
colors = ["#%02x%02x%02x" % (int(r), int(g), 150) for r, g in zip(50 + 2 * x, 30 + 2 * y)]

TOOLS = "resize,crosshair,pan,wheel_zoom,box_zoom,undo,redo,reset,tap,save,box_select,poly_select,lasso_select"
TOOLS = "resize,crosshair,pan,wheel_zoom,box_zoom,undo,redo,reset"


def p():
    p = figure(tools=TOOLS, plot_width=400, plot_height=300, webgl=False)
    p.logo = 'grey'
    p.title = 'Color Scatter 1'
    p.title_location = 'right'

    p.scatter(x, y, radius=radii, fill_color=colors, fill_alpha=0.6, line_color=None)
    return p

layout = GridPlot(
    children=[
        [p(), p(), p(), p()],
        [p(), p(), p(), p()],
        [p(), p(), p(), p()],
        [p(), p(), p(), p()],
    ],
    toolbar_location=None,
    sizing_mode='stretch_both'
)

toolbar_locations = [None, 'above', 'right', 'below', 'left']
tb = 1

#layout = GridPlot(
#    children=[
#        [p(), p()],
#    ],
#    toolbar_location=toolbar_locations[tb],
#    responsive='fixed'
#)
show(layout)
