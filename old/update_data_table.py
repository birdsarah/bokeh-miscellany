import numpy as np
from numpy import pi

from bokeh.client import push_session
from bokeh.driving import cosine
from bokeh.plotting import figure, curdoc

from bokeh.models import ColumnDataSource
from bokeh.models.widgets import TableColumn,  DataTable
from bokeh.io import show, vform

x = np.linspace(0, 4*pi, 80)
y = np.sin(x)

source = ColumnDataSource(data=dict(x=x, y=y))

p = figure()
r1 = p.line([0, 4*pi], [-1, 1], color="firebrick")
r2 = p.line(x='x', y='y', color="navy", line_width=4, source=source)

columns = [TableColumn(field="x", title="X"),TableColumn(field="y", title="Y")]
data_table = DataTable(source=source, columns=columns, width=400, height=280)


session = push_session(curdoc())

@cosine(w=0.03)
def update(step):
    r2.data_source.data["y"] = y * step
    r2.glyph.line_alpha = 1 - 0.8 * abs(step)


layout = vform(data_table)
show(layout)

curdoc().add_periodic_callback(update, 50)
session.show() # open the document in a browser
session.loop_until_closed()
