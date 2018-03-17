from __future__ import print_function
import numpy as np
import bokeh.plotting as bk
import time
import bokeh
from bokeh.models import (
    Range1d, Plot, LinearAxis, Grid, DataRange1d,
    PanTool, WheelZoomTool, BoxZoomTool, ResetTool, PreviewSaveTool)
from bokeh.models.glyphs import (Circle, Segment)

# initialize
numE = 20000
numN = 20000
plot_height = 800
plot_width = 1000
title = "Timing Test"
htmlout = "Timing_Test.html"

# circles
nodex = np.random.random(numN)
nodey = np.random.random(numN)
nsize = 5*np.ones(numN)
ncolor = numN*['blue']
nalpha = numN*[0.5]
nid = [str(i) for i in np.arange(numN)]

# lines
ex0 = np.random.random(numE)
ex1 = np.random.random(numE)
ey0 = np.random.random(numE)
ey1 = np.random.random(numE)
ewidth = np.ones(numE)
ecolor = numE*['red']
ealpha = numE*[0.3]
eid = [str(i) for i in np.arange(numE)]

# ColumnDataSources
nsource = bk.ColumnDataSource(
    data=dict(
        nid=nid,
        x=nodex,
        y=nodey,
        size=nsize,
        color=ncolor,
        alpha=nalpha
    )
)
esource = bk.ColumnDataSource(
    data=dict(
        eid=eid,
        ex0=ex0, ey0=ey0,
        ex1=ex1, ey1=ey1,
        ewidth=ewidth,
        ecolor=ecolor,
        ealpha=ealpha
    )
)

# plot
################
# Start timer
t0 = time.time()
################

x_range = Range1d(0, 1)
y_range = Range1d(0, 1)
plot = Plot(x_range=x_range, y_range=y_range,
         plot_width=plot_width, plot_height=plot_height, title=title)
plot.add_tools(PanTool(), WheelZoomTool(), BoxZoomTool(),
               PreviewSaveTool(), ResetTool())

# edges
seg = Segment(x0="ex0", y0="ey0", x1="ex1", y1="ey1", \
        line_width="ewidth",)
seg_glyph = plot.add_glyph(esource, seg)

# circles
circ = Circle(x="x", y="y", size='size', line_color=None)
circ_glyph = plot.add_glyph(nsource, circ)

################
# End Timer
print(bokeh.__version__)
print("Time to plot with Bokeh:", time.time() - t0, "seconds")

# save
bk.output_file(htmlout, mode='cdn')

################
# End Timer
print(bokeh.__version__)
print("Time to plot with Bokeh:", time.time() - t0, "seconds")


bk.save(obj=plot)

################
# End Timer
print(bokeh.__version__)
print("Time to plot with Bokeh:", time.time() - t0, "seconds")
################

# show
bk.show(plot)
