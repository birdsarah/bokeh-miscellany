from bokeh.io import show
from bokeh.plotting import figure
from bokeh.models import Range1d

data = {
    'binning': [(0, 1), (1,2), (3,4), (5,6)],
    'values': [100, 80, 60, 20]
}


plot = figure(
    x_range=(data['binning'][0][0], data['binning'][-1][-1]),
    tools="pan,wheel_zoom,box_zoom,reset",
    active_drag="box_zoom",
    toolbar_location="right",
    x_axis_type="auto",
    y_axis_type="log"
)


xs = []
ys = []


xs.append((data['binning'][0][0], data['binning'][0][0]))
ys.append((0, data['values'][0]))

for i in range(len(data['values'])):
    x = data['binning'][i]
    y = data['values'][i]

    if i == len(data['values']) - 1:
        next_y = 0
    else:
        next_y = data['values'][i+1]

    # horizontal bar
    xs.append((x[0], x[1]))
    ys.append((y, y))

    # vertical bar
    xs.append((x[1], x[1]))
    ys.append((y, next_y))

plot.multi_line(xs, ys, color="blue", line_width=2)


# Background
p_xs = [item for sublist in xs for item in sublist]
p_ys = [item for sublist in ys for item in sublist]

plot.patch(p_xs, p_ys, alpha=0.6, line_width=0, fill_color="red")

show(plot)
