from bokeh.models.widgets import (
    # buttons
    Button, Dropdown, Toggle,
    # icons
    Icon,
    # groups
    CheckboxButtonGroup, CheckboxGroup, RadioButtonGroup, RadioGroup,
    # inputs
    AutocompleteInput, DatePicker, DateRangeSlider, InputWidget, MultiSelect, Select, Slider, TextInput,
    # markups
    Div, Paragraph, PreText,
    # dialog
    Dialog,
)
# We're not demo-ing Tabs or DataTable, as they are available in other demos
from bokeh.layouts import widgetbox, layout, column
from bokeh.io import show
from bokeh.plotting import figure

sizing_mode = 'stretch_both'

# Buttons
button = Button(label="Button (with icon)", icon=Icon(icon_name="check"))
toggle = Toggle()
dropdown = Dropdown(menu=[("Item 1", "item_1_value"), ("Item 2", "item_2_value")], default_value="item_1_value")
buttons = widgetbox(Paragraph(text="The bokeh buttons"), button, toggle, dropdown, sizing_mode=sizing_mode)

# Dialog
# dialog = Dialog(closable=True, content="This is a dialog", title="Dialog", visible=True)

# Groups
checkbox_group = CheckboxGroup(labels=["Option 1", "Option 2", "Option 3"], active=[0, 1])
radio_group = RadioGroup(labels=["Option 1", "Option 2", "Option 3"], active=0)
checkbox_button_group = CheckboxButtonGroup(labels=["Option 1", "Option 2", "Option 3"], active=[0, 1])
radio_button_group = RadioButtonGroup(labels=["Option 1", "Option 2", "Option 3"], active=0)
groups = widgetbox(Paragraph(text="The bokeh groups"), checkbox_group, radio_group, checkbox_button_group, radio_button_group, sizing_mode=sizing_mode)

# Markups
div = Div(text="Some custom <strong>bold</strong> text")
paragraph = Paragraph(text="this is a paragraph")
pretext_1 = PreText(text="This is pre. I could put a bunch of code in here perhaps\nOr maybe something else")
pretext_2 = PreText(text="This is pre")
pretext_3 = PreText(text="This is pre it's a bit longer and i'm going to constrict it.", width=150)
markups = widgetbox(Paragraph(text="The bokeh markups"), div, paragraph, pretext_1, pretext_2, pretext_3, sizing_mode=sizing_mode)

# Inputs
#daterangeslider = DateRangeSlider()  # Known broken
slider = Slider(title="Slider", start=0, end=10, width=100)
multiselect = MultiSelect(options=['1', '2', '3'])
select = Select(options=['1', '2', '3'])
textinput = TextInput()
autocomplete = AutocompleteInput(completions=['one', 'two', 'three'])
#datepicker = DatePicker()
inputs = widgetbox(Paragraph(text="The bokeh inputs"), slider, multiselect, select, textinput, autocomplete, sizing_mode=sizing_mode)

plot = figure(sizing_mode=sizing_mode)
plot.circle(x=[1, 2], y=[2, 3])

l = layout([
    [buttons, groups],
    [markups, inputs],
    [plot],
], sizing_mode=sizing_mode)

show(l)
