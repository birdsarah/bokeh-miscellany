from flask import Flask, render_template_string
from bokeh import charts, plotting as plt
from bokeh.embed import components

import pandas as pd
import numpy as np
import io

app = Flask(__name__)

template = '''
<html>
<head>
<link rel="stylesheet" href="http://cdn.pydata.org/bokeh/release/bokeh-0.9.1.min.css" type="text/css" />
<script type="text/javascript" src="http://cdn.pydata.org/bokeh/release/bokeh-0.9.1.min.js"></script>
{{ script | safe }}
</head>
<body>
{{ chart | safe}}
</body>
</html>
'''

data = '''temp,freq,x
-10,30,20705
-10,10,19758
-10,3,18686
-10,1,17514
0,30,16983
0,10,15724
0,3,14292
0,1,12919
10,30,12309
10,10,10792
10,3,9149
10,1,7678
15,30,9845
15,10,8279
15,3,6638
15,1,5239
20,30,7501
20,10,5980
20,3,4469
20,1,3272
30,30,3704
30,10,2559
30,3,1636
30,1,1041
40,30,1440
40,10,879
40,3,511
40,1,319'''


@app.route("/")
def charts():
    pallet_color = [
        "#999999", "#E69F00", "#56B4E9", "#009E73", "#F0E442",
        "#0072B2", "#D55E00", "#CC79A7"
    ]

    params = {
        'title': 'Chart',
        'width': 600, 'height': 400,
        'x_axis_label': 'X AXIS LABEL',
        'y_axis_label': 'Y AXIS LABEL',
        'x_axis_type': 'log',
        'y_axis_type': 'log'
    }

    _df = pd.read_csv(io.StringIO(data))
    _df.sort(['temp', 'freq'], inplace=True)

    df_key = sorted(set(_df.temp))

    p = plt.figure(**params)

    for k, i in enumerate(df_key):
        df_graph = _df[_df.temp == i]
        p.line(
            df_graph['freq'], df_graph['x'], legend='%s X' % i, line_width=2,
            color=pallet_color[k]
        )

     # plots can be a single PlotObject, a list/tuple, or even a dictionary
    plots = {'chart': p}

    script, div = components(plots)

    return render_template_string(
        source=template, script=script, **div
    )



if __name__ == "__main__":
    app.debug = True
    app.run(host='127.0.0.1', port=5001)
