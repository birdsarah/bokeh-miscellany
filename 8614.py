from bokeh.io import curdoc
from bokeh.models import Button, Tabs, Panel, TextInput
from bokeh.layouts import column
from bokeh.models import ColumnDataSource
from bokeh.plotting import figure


def update_options():
    source.data = {'x': [x for x in range(5)],
                   'y': [y**2 for y in range(5)]}


button = Button(label='Update Data')
button.on_click(update_options)

source = ColumnDataSource(data=dict(x=[], y=[]))
plot = figure()
plot.circle('x', 'y', source=source)

layout1 = column(TextInput(title='Text Input:'), plot)
layout2 = column(TextInput(title='Text Input:'), button)

tab1 = Panel(child=layout1, title='tab1')
tab2 = Panel(child=layout2, title='tab2')
tabs = Tabs(tabs=[tab1, tab2])

curdoc().add_root(tabs)
