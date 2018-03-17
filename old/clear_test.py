# remove.py

import numpy as np

from bokeh.io import curdoc
from bokeh.models import Button
from bokeh.plotting import figure, curdoc, vplot

xs = np.random.normal(loc=1.0, size=100)
ys = np.random.normal(loc=1.0, size=100)

TOOLS="pan,wheel_zoom,box_select,lasso_select"

p = figure(tools=TOOLS, plot_width=600, plot_height=600, title=None, min_border=10, min_border_left=50)
r = p.scatter(xs.tolist(), ys.tolist(), size=3, color="#3A5785", alpha=0.6)

source = r.data_source
empty_selection = r.data_source.selected

def callback():
    source.selected = empty_selection

button = Button(label="Remove Points", width=20)
button.on_click(callback)

# put the button and plot in a layout and add to the document
curdoc().add_root(vplot(button, p))
