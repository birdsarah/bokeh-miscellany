import numpy as np

from bokeh.plotting import figure, show, output_file
from bokeh.models import GridPlot
output_file("color_scatter.html", title="color_scatter.py example")

N = 4000
x = np.random.random(size=N) * 100
y = np.random.random(size=N) * 100
radii = np.random.random(size=N) * 1.5
colors = ["#%02x%02x%02x" % (int(r), int(g), 150) for r, g in zip(50 + 2 * x, 30 + 2 * y)]

TOOLS = "resize,crosshair,pan,wheel_zoom,box_zoom,undo,redo,reset,tap,save,box_select,poly_select,lasso_select"

p1 = figure(tools=TOOLS, height=200, toolbar_location=None, responsive='box')
p1.scatter(x, y, radius=radii, fill_color=colors, fill_alpha=0.6, line_color=None)
p2 = figure(tools=TOOLS, height=200, toolbar_location=None, responsive='box')
p2.scatter(x, y, radius=radii, fill_color=colors, fill_alpha=0.6, line_color=None)

layout = GridPlot(children=[[p1,p2]])


show(layout)
