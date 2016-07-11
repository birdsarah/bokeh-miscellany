from bokeh.models import DatePicker, HBox
from bokeh.io import curdoc

from datetime import datetime

beginning = DatePicker(title="Begin Date", min_date=datetime(2014,11,1),
                       max_date=datetime.now(),
                       value=datetime(datetime.now().year,1,1))

def cb(attr, old, new):
  print(new)

beginning.on_change('value', cb)

curdoc().add_root(HBox(children=[beginning]))

