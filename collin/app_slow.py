##############
##############
##  on windows:  To run, in terminal:  bokeh serve --allow-websocket-origin=localhost:5005 bokeh_widget_test.py --port 5005
##   on windows:  http://localhost:5005/bokeh_widget_test
###############
###############
from bokeh.plotting import curdoc, figure
from bokeh.io import output_file, show
from bokeh.layouts import widgetbox
from bokeh.models import ColumnDataSource
from bokeh.models.widgets import DataTable, TableColumn
import pandas as pd

from bokeh.layouts import row, column
from bokeh.models import Select
from bokeh.plotting import curdoc

import datetime
import numpy as np


######################
######################
##  Pick webpage speed you want by using True/False
slow_table = True
######################
######################

######################
######################
##  slect desired row and column numbers (initially tested with 10000 rows and 30 columns)
row_num = 10000
column_num = 30
######################
######################

todays_date = datetime.datetime.now().date()
index = pd.date_range(todays_date-datetime.timedelta(10), periods=row_num, freq='D')

columns = []

x = 0
while x < 30:
    columns.append("Dummy%d"%(x))
    x+=1    

df = pd.DataFrame(index=index, columns=columns)
df = df.fillna(0) # with 0s rather than NaNs
data = np.array([np.arange(row_num)]*column_num).T
df = pd.DataFrame(data, index=index, columns=columns)

output_file("data_table.html")
legendHeaders_short = ["Dummy1" ,"Dummy2"]
legendHeaders_long = columns
x = 0
while x < 30:
    legendHeaders_long.append("Dummy%d"%(x))
    x+=1
    
columns = []

if slow_table == True:
    headers = legendHeaders_long
else:
    headers = legendHeaders_short

for h in headers:
    tc = TableColumn(field=h, title=h, width=300)
    columns.append(tc)

source = ColumnDataSource(df)

data_table = DataTable(source=source, columns=columns, width=750, height=280)

tools = 'pan,wheel_zoom,box_zoom,xbox_select,reset'
fig1 = figure(plot_height=400, plot_width=400, tools=tools)
r =fig1.circle(x = 'Dummy1',y = 'Dummy2', size=5, source=source, selection_color="orange", alpha=0.6, nonselection_alpha=0.1, selection_alpha=0.4)

#setup page
widgets = column(data_table, fig1)
main_row = row(widgets)
home = column(main_row)
curdoc().title = "Table Test" 
curdoc().add_root(home)
