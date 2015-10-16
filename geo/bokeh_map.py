import pandas as pd
from bokeh.io import output_file, save
from bokeh.embed import file_html
from bokeh.models import (
    Circle, GMapPlot, DataRange1d, ColumnDataSource,
    PanTool, WheelZoomTool, BoxSelectTool, BoxZoomTool,
    BoxSelectionOverlay, GMapOptions, LinearAxis, CrosshairTool, HoverTool, Grid
)

output_file('bokeh_map.html', mode='relative-dev')

# Process the data
stations = pd.read_json('stations.json').T
stations = stations.rename(columns={0: 'latitude', 1: 'longitude', 2: 'name', 3: 'data'})

x_range = DataRange1d()
y_range = DataRange1d()

map_options = GMapOptions(
    lat=37.76487, lng=-122.41948, zoom=6, map_type="roadmap"
)

plot = GMapPlot(
    x_range=x_range, y_range=y_range,
    map_options=map_options,
    title=None,
)

circle = Circle(y="longitude", x="latitude", size=10, fill_color="red", line_color=None)
plot.add_glyph(ColumnDataSource(stations), circle)
xaxis = LinearAxis()
yaxis = LinearAxis()
plot.add_layout(xaxis, 'left')
plot.add_layout(yaxis, 'below')
plot.add_layout(Grid(dimension=0, ticker=xaxis.ticker))
plot.add_layout(Grid(dimension=1, ticker=yaxis.ticker))

plot.add_tools(PanTool(), WheelZoomTool(), CrosshairTool())
save(plot)
