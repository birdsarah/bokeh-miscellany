from bokeh.models import Button
from bokeh.plotting import figure, gridplot
from bokeh.io import vform, output_file, show

output_file("3943.html")

w = 300
h = 150

fig1 = figure(width=w, height=h, tools=[])
fig1.circle(x=[0,1,3,4], y=[10,4,1,5])

fig2 = figure(width=w, height=h, tools=[])
fig2.circle(x=[0,1,3,4], y=[10,4,1,5])

fig3 = figure(width=w, height=h, tools=[])
fig3.circle(x=[0,1,3,4], y=[10,4,1,5])

fig4 = figure(width=w, height=h, tools=[])
fig4.circle(x=[0,1,3,4], y=[10,4,1,5])

grid = gridplot([[fig1, fig2], [fig3, fig4]])
button = Button(label="Click")

v = vform(button, grid)
show(v)
