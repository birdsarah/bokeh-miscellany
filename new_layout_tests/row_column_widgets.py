from bokeh.document import Document
from bokeh.embed import file_html
from bokeh.models import Row, Slider, TextInput, Select, Div, Button, Icon, Column, WidgetBox
from bokeh.resources import INLINE
from bokeh.util.browser import view

sizing_mode='scale_width'

intro = Div(text="""
<h4>Layout of widgets</h4>
<p>In the first row: vertically the widgets should had equal(ish) whitespacing
between each other giving a sense of visual consistency;
horizontally, neighboring widgets should line up - even though they are in seperate columns.</p>
<p>In the second row, the columns should line up with the column above, making
the buttons fairly spread out but lining up with their column
above.</p>
<p>In the third row, the slider should span the width of the two columns as it is not in a column. It's outside edges should
align with the sliders in the first row.</p>
<p>Finally in the fourth row, the two columns should align with the first row.</p>
""", sizing_mode=sizing_mode)


def make_widgets(sizing_mode='stretch_both'):
    return dict(
        reviews=Slider(title="Minimum number of reviews", value=80, start=10, end=300, step=10, sizing_mode=sizing_mode, height=100, width=100),
        genre=Select(title="Genre", value="All", options=["All", "Action", "DramaDramaDrama", "Comedy"], sizing_mode=sizing_mode, height=100, width=100),
        oscars=Slider(title="Minimum number of Oscar wins", start=0, end=4, value=0, step=1, sizing_mode=sizing_mode, height=100, width=100),
        director=TextInput(title="Director name contains a whole.", sizing_mode=sizing_mode, width=150, height=100),
        x_axis=Select(title="X Axis", options=["Tomato Meter", "Number of Review", "Dollars at box office"], value="Tomato Meter", sizing_mode=sizing_mode),
        y_axis=Select(title="Y Axis", options=["Tomato Meter", "Number of Review", "Dollars at box office"], value="Number of Reviews", sizing_mode=sizing_mode)
    )


w1 = make_widgets(sizing_mode)
w2 = make_widgets(sizing_mode)
check = Icon(icon_name='check')


Column(w1['genre'], w1['director'], w1['x_axis'], w1['y_axis'], sizing_mode=sizing_mode)
Column(w2['genre'], w2['director'], w2['x_axis'], w2['y_axis'], sizing_mode=sizing_mode)

layout = Column(
    Row(intro, sizing_mode=sizing_mode),
    Row(
        WidgetBox(w1['reviews'], w1['genre'], w1['oscars'], w1['director'], w1['x_axis'], w1['y_axis'], sizing_mode=sizing_mode),
        WidgetBox(w2['y_axis'], w2['reviews'], w2['genre'], w2['oscars'], w2['director'], w2['x_axis'], sizing_mode=sizing_mode),
        sizing_mode=sizing_mode
    ),
    Row(
        WidgetBox(Button(label="Left column", icon=check, sizing_mode=sizing_mode), sizing_mode=sizing_mode),
        WidgetBox(Button(label="Right column", sizing_mode=sizing_mode), sizing_mode=sizing_mode),
        sizing_mode=sizing_mode
    ),
    Row(Slider(title="Full width slider", value=22, start=22, end=88, step=11, sizing_mode=sizing_mode), sizing_mode=sizing_mode),
    Row(
        WidgetBox(Slider(title="Left slider", value=-1, start=-10, end=-1, step=1, sizing_mode=sizing_mode), sizing_mode=sizing_mode),
        WidgetBox(Slider(title="Right slider", value=10, start=10, end=100, step=10, sizing_mode=sizing_mode), sizing_mode=sizing_mode),
        sizing_mode=sizing_mode
    ),
    sizing_mode=sizing_mode
)

doc = Document()
doc.add_root(layout)

if __name__ == "__main__":
    filename = "row_column_widgets.html"
    with open(filename, "w") as f:
        f.write(file_html(doc, INLINE, "Widgets in rows and columns."))
    print("Wrote %s" % filename)
    view(filename)
