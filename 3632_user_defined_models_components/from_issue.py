from bokeh.plotting import figure
from bokeh.models import Range1d, TMSTileSource
from bokeh.models import  WheelZoomTool, PanTool
from bokeh.embed import components

from jinja2 import Environment

class CustomTileSource(TMSTileSource):
    __implementation__ = """
    _ = require "underscore"
    Util = require "util/util"
    TMSTileSource = require "renderer/tile/tms_tile_source"
    class CustomTileSource extends TMSTileSource.Model

      type: "CustomTileSource"

      initialize: () ->
        @set('x_origin_offset', 0)
        @set('y_origin_offset', 0)
        @set('initial_resolution', 134217.728)
        super

    module.exports =
      Model: CustomTileSource
    """

from bokeh.resources import EMPTY
EMPTY.render()

html_template = """
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Embed Example</title>
        <link rel="stylesheet" href="http://cdn.pydata.org/bokeh/release/bokeh-0.11.0.min.css" type="text/css" />
        <script type="text/javascript" src="http://cdn.pydata.org/bokeh/release/bokeh-0.11.0.min.js"></script>
        {{ bokeh_script|safe }}
    </head>
    <body>
    {{ plot | safe }}
    </body>
</html>
"""

x_range = Range1d(start=0, end=1200)
y_range = Range1d(start=0, end=800)

custom_service = 'http://localhost:8081/tiles/{filter_size}/{band}/{Z}/{X}/{Y}.png?clim=0.0,70.0'
extra_url_vars = {}
extra_url_vars['filter_size'] = '1.024'
extra_url_vars['band'] = '0'

tile_source = CustomTileSource()
tile_source.url = custom_service
tile_source.extra_url_vars = extra_url_vars

p = figure(x_range=x_range, y_range=y_range, plot_height=800, plot_width=800)
p.add_tools(WheelZoomTool(), PanTool())
p.add_tile(tile_source)

script, div = components(p)

content = Environment().from_string(html_template).render(bokeh_script=script, plot=div)

with open('from_issue.html', 'w') as f:
    f.write(content)
