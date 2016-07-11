from bokeh.models import Slider, WidgetBox
from bokeh.layouts import row, widgetbox
from bokeh.io import show

r_slider = Slider(start=0, end=255, value=22, step=1, width=500, title="R")

show(r_slider)
