# -*- coding: utf-8 -*-
"""
Created on Thu Sep 10 13:51:46 2015

@author: mdurant
"""
import numba
import numpy as np
from bokeh.plotting import figure
from bokeh.models import ColumnDataSource, CustomJS, BoxSelectTool, TextInput
from bokeh.models import Plot
from bokeh.properties import Instance
from bokeh.server.app import bokeh_app
from bokeh.server.utils.plugins import object_page
from bokeh.models.widgets import HBox, VBoxForm, Slider


@numba.jit(nopython=True)
def mandel_inner(xs, ys, n, maxi, escape):
    for i in range(n):
        for j in range(n):
            z = 0 + 0j
            c = xs[i] + 1j * ys[j]

            esc = maxi
            for it in range(maxi):
                z = z*z + c
                if z.real*z.real + z.imag*z.imag > 4:
                    esc = it
                    break
            escape[j, i] = esc

    return escape


def mandel(x0, x1, y0, y1, n=400, maxi=30):
    escape = np.empty((n, n), 'int32')
    return mandel_inner(xs, ys, n, maxi, escape)

n = 1200
xs = np.linspace(-2, 1, n)
ys = np.linspace(-1, 1, n)
im = mandel(-2, 1, -1, 1, n=n)


@numba.jit
def julia_inner(c, xs, ys, n, maxi, escape):
    for i in range(n):
        for j in range(n):
            z = xs[i] + 1j * ys[j]

            esc = maxi
            for it in range(maxi):
                z = z*z + c
                if z.real*z.real + z.imag*z.imag > 4:
                    esc = it
                    break
            escape[j, i] = esc
    return escape


def julia(c, n=400, maxi=30):
    escape = np.empty((n, n), 'int32')
    return julia_inner(c, xs, ys, n, maxi, escape)


class SlidersApp(HBox):
    """An example of a browser-based, interactive plot with slider controls."""

    extra_generated_classes = [["SlidersApp", "SlidersApp", "HBox"]]

    text = Instance(TextInput)
    plot = Instance(Plot)
    source = Instance(ColumnDataSource)

    @classmethod
    def create(cls):
        """One-time creation of app's objects.

        This function is called once, and is responsible for
        creating all objects (plots, datasources, etc)
        """
        obj = cls()

        obj.source = ColumnDataSource(data={'im': [im], 'xs': [xs[0]],
                                      'ys': [ys[0]], 'w': [xs[-1] - xs[0]],
                                      'h': [ys[-1] - ys[0]]})

        obj.text = TextInput(title="title", name='title', value='wave')
        print(obj.text.__dict__)
        c = CustomJS()
        code="""console.log('x: '+((cb_data['geometry']['x1']+
            cb_data['geometry']['x0'])/2) + ', y: '+((cb_data['geometry']['y1']
            +cb_data['geometry']['y0'])/2))"""
        c.code = code + """;document.getElementById("{0}").value='new';
           console.log(document.getElementById("{0}"))""".format(obj.text._id)

        # Generate a figure container
        plot = figure(x_range=(-2, 1), y_range=(-1, 1),
                      tools=[BoxSelectTool(callback=c)], plot_width=450,
                      plot_height=300, toolbar_location=None)

        # Plot the line by the x,y values in the source property
        plot.image("im", 'xs', 'ys', 'w', 'h', source=obj.source,
                         palette="Spectral11", name='im')

        obj.plot = plot
        obj.children.append(obj.text)
        obj.children.append(obj.plot)

        return obj

    def setup_events(self):
        """Attaches the on_change event to the value property of the widget.

        The callback is set to the input_change method of this app.
        """
        super(SlidersApp, self).setup_events()
        if not self.text:
            return
        self.text.on_change('value', self, 'input_change')

    def input_change(self, obj, attrname, old, new):
        """Args:
            obj : the object that changed
            attrname : the attr that changed
            old : old value of attr
            new : new value of attr
        """
        self.plot.title = self.text.value


# The following code adds a "/bokeh/sliders/" url to the bokeh-server. This
# URL will render this sine wave sliders app. If you don't want to serve this
# applet from a Bokeh server (for instance if you are embedding in a separate
# Flask application), then just remove this block of code.
@bokeh_app.route("/bokeh/sliders/")
@object_page("sin2")
def make_sliders():
    app = SlidersApp.create()
    return app
