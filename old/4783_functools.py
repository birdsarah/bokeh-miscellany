#!/usr/bin/python2
from functools import partial
from random import random
from threading import Thread
import time

from bokeh.client import push_session
from bokeh.models import ColumnDataSource
from bokeh.plotting import curdoc, figure, show

from tornado import gen

source = ColumnDataSource(data=dict(x=[0], y=[0]))

doc = curdoc()
session = push_session(doc)

@gen.coroutine
def update(x, y):
    source.stream(dict(x=[x], y=[y]))

def blocking_task():
    while True:
        time.sleep(0.1)
        x, y = random(), random()

        doc.add_next_tick_callback(partial(update, x=x, y=y))

p = figure(x_range=[0, 1], y_range=[0, 1])
l = p.circle(x='x', y='y', source=source)

doc.add_root(p)

thread = Thread(target=blocking_task)
thread.start()

session.show(p)
session.loop_until_closed()
