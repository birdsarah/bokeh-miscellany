import pandas as pd
import numpy as np
import chartify

from bokeh.io import show
from bokeh.layouts import gridplot

df = pd.DataFrame({'values': [1000, 10, 100, 20]})
df['labels'] = df['values']


# breaks
breaks = chartify.Chart(x_axis_type='categorical', y_axis_type='log')
breaks.plot.bar(df, 'labels', 'values')

# works
factors = [str(x) for x in [1000, 100, 10, 1]]
works = chartify.Chart(x_axis_type='categorical', y_axis_type='log')
works.plot._set_categorical_axis_default_factors(True, factors)
works.figure.vbar(x=factors, top=[1000, 100, 10, 1], bottom=0.1, width=1, fill_color='blue')

# works2
works2 = chartify.Chart(x_axis_type='categorical', y_axis_type='linear')
works2.plot.bar(df, 'labels', 'values')

show(gridplot([works.figure, works2.figure, breaks.figure], ncols=1))
