import pandas as pd
from bokeh.io import output_file, show
from bokeh.layouts import layout
from bokeh.plotting import figure

data = pd.Series.from_csv('all_counts.csv')
p_all = figure(tools='save', title='all')
p_all.vbar(data.index, top=data.values, width=0.9)

p_close = figure(tools='save, box_zoom, reset', title='closeup', x_range=(0, 250), y_range=(0, 20))
p_close.vbar(data.index, top=data.values, width=0.9)

l = layout([[p_all], [p_close]])
output_file('all_counts.html')
show(l)

