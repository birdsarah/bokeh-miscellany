from bokeh.io import curdoc
from bokeh.layouts import row, column
from bokeh.plotting import figure
from bokeh.models import ColumnDataSource, HoverTool, TapTool

main_source = ColumnDataSource({
    'x_col': [1, 2, 3, 1, 2, 3, 1, 2, 3],
    'y_col': [2, 4, 6, 5, 3, 2, 1, 5, 4],
    'data': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
})
nearest_neighbors_source = ColumnDataSource({
    'x_col': [],
    'y_col': [],
    'data': []
})
p = figure(title=None, tools='')
main = p.scatter(
    x='x_col',
    y='y_col',
    size=20,
    source=main_source,
    # default visual properties
    fill_color='#208F8C',
    fill_alpha=0.4,
    line_color=None,
    # visual properties for selected glyphs
    selection_fill_color='#440154',
    selection_fill_alpha=0.8,
    selection_line_color=None,
    # visual properties for non-selected glyphs
    nonselection_fill_color='#208F8C',
    nonselection_fill_alpha=0.4,
    nonselection_line_color=None,
    # hover properties
    hover_fill_color='#440154',
    hover_fill_alpha=0.4,
    hover_line_color=None,
)
p.scatter(
    x='x_col',
    y='y_col',
    size=20,
    source=nearest_neighbors_source,
    fill_color='#FDE724',
    line_color=None,
    selection_fill_color='#FDE724',
    selection_line_color=None,
    nonselection_fill_color='#FDE724',
    nonselection_line_color=None,
    hover_fill_color='#FDE724',
    hover_line_color=None,
)
hover = HoverTool(tooltips='We will make this pretty later Data: @data', renderers=[main])
tap = TapTool(renderers=[main])
p.add_tools()


def show_nearest_neighbors(attr, old, new):
    nearest_neighbors_source.data = {
        'x_col': [],
        'y_col': [],
        'data': []
    }
    import time; time.sleep(0.1)
    nearest_neighbors_source.data = {
        'x_col': [1, 2, 3],
        'y_col': [2, 4, 6],
        'data': ['a', 'b', 'c']
    }


def clear_nearest_neighbors_and_show(attr, old, new):
    nearest_neighbors_source.data = {
        'x_col': [],
        'y_col': [],
        'data': []
    }
    import pdb; pdb.set_trace()
    main_source.selected = new
    nearest_neighbors_source.data = {
        'x_col': [1, 2, 3],
        'y_col': [2, 4, 6],
        'data': ['a', 'b', 'c']
    }


main_source.on_change('selected', show_nearest_neighbors)
#nearest_neighbors_source.on_change('selected', clear_nearest_neighbors_and_show)


layout = row(p)

curdoc().add_root(layout)
