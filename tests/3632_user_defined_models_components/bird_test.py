from bokeh.plotting import figure
from bokeh.models import Range1d, TMSTileSource
from bokeh.models import WheelZoomTool, PanTool
from bokeh.embed import components, _bundle_for_objs_and_resources
from bokeh.resources import CDN

from jinja2 import Template


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
bokeh_js, bokeh_css = _bundle_for_objs_and_resources([p], CDN)

with open('bird_test.html', 'w') as f:
    html_template = Template("""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Embed Example</title>
            {{ bokeh_css }}
            {{ bokeh_js }}
        </head>
        <body>
            {{ div }}
            {{ script|safe }}
        </body>
    </html>
    """)
    html = html_template.render(script=script, div=div, bokeh_js=bokeh_js, bokeh_css=bokeh_css)
    f.write(html)
