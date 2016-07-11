import pandas as pd
from bokeh.plotting import figure
from bokeh.models import ColumnDataSource, TextInput, DatetimeTickFormatter, FactorRange, CategoricalTicker
from bokeh.io import output_notebook, show, curdoc
from bokeh.layouts import widgetbox, layout, row


p = figure(plot_height=600)

# configure x axis
p.x_range = FactorRange()
p.xaxis[0].formatter = DatetimeTickFormatter(formats=dict(
    hours=["%Y-%m-%d"],
    days=["%Y-%m-%d"],
    months=["%Y-%m-%d"],
    years=["%Y-%m-%d"],
))


source = ColumnDataSource(data=dict(x=[], y=[]))
r = p.circle(x='x', y='y', source=source)


from_date = TextInput(value='2016-03-01',
                      title='Please enter the starting date in the format of yyyy-mm-dd')
to_date = TextInput(value='2016-04-30',
                    title='Please enter the ending date in the format of yyyy-mm-dd')


controls = [from_date, to_date]
w_box = widgetbox(controls, width=200)
# page_layout = row(w_box, p)
page_layout = row(children=[w_box, p])

def update_plot(attr, old, new):
  d_range = pd.date_range(from_date.value.strip(), to_date.value.strip()).strftime('%Y-%m-%d')

  page_layout.width = 25 + len(d_range) * 65 + 25 - 200
  p.width = 25 + len(d_range) * 65 + 25

  print(p.plot_width)


from_date.on_change('value', update_plot)
to_date.on_change('value', update_plot)


curdoc().add_root(page_layout)
