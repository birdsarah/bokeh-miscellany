from bokeh.plotting import Figure, curdoc
from bokeh.models.widgets import Panel, Tabs, TextInput
from bokeh.client import push_session
from bokeh.io import hplot
from bokeh.palettes import Spectral11

import numpy as np


x = np.linspace(-2*np.pi, 2*np.pi, 200)

colour_list = Spectral11 #[(51, 153, 51) ,(153, 51, 51), (51, 51, 153), (153, 51,153 ), (153, 51, 51)]

y = np.sin(x)
w = np.cos(x)

z = np.arcsin(x)
u = np.arccos(x)

v = np.arctan(x)
r = np.tan(x)

list_of_axis = [(y,w), (z, u), (v,r)]

tabs = []
for two in list_of_axis:
    figure_obj = Figure(plot_width = 1000, plot_height = 800, title = "these are waves")
    figure_obj.line(x, two[0], line_width = 2, line_color = colour_list[3])
    figure_obj.line(x, two[1], line_width = 2, line_color = colour_list[1])
    title = "two by two"
    tabs.append(Panel(child=figure_obj, title=title))

curdoc().add_root(Tabs(tabs=tabs))
