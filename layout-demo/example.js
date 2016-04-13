var Solver = Bokeh.require('common/solver');
var layoutableModule = Bokeh.require('common/layoutable');
var rowModule = Bokeh.require('common/row');
var Row = rowModule.Model;
var columnModule = Bokeh.require('common/column');
var Column = columnModule.Model;
var demoWidgetModule = Bokeh.require('common/demo_widget');
var kiwi = Bokeh.require("kiwi");
var $ = Bokeh.$;

var EQ = layoutableModule['EQ'];

var rootLayoutable = null;

function refresh() {
  var width = window.innerWidth - 20;
  var height = window.innerHeight - 20;
  $("#toplevel").width(width).height(height).css({ top: '10px', left: '10px', position: 'absolute' });

  var window_width_var = new kiwi.Variable(width);
  var window_height_var = new kiwi.Variable(height);

  // we don't want to make a new solver each time in real code
  var solver = new Solver();

  solver.add_edit_variable(window_width_var);
  solver.add_edit_variable(window_height_var);
  solver.suggest_value(window_width_var, width);
  solver.suggest_value(window_height_var, height);

  var constraints = rootLayoutable.get_constraints();
  for (var i = 0; i < constraints.length; ++i) {
    solver.add_constraint(constraints[i]);
  }

  // set the size of the root layoutable to the window size
  var root_vars = rootLayoutable.get_constrained_variables();
  var root_width = root_vars['width'];
  var root_height = root_vars['height'];
  solver.add_constraint(EQ(root_width, [-1, window_width_var]));
  solver.add_constraint(EQ(root_height, [-1, window_height_var]));

  solver.update_variables();

  rootLayoutable.variables_updated();
}

function main() {
    var Plot = demoWidgetModule.Model;

    var widget1 = new Plot({ title: "A plot" });
    var widget2 = new Plot({ left_axis: false });
    var row1 = new Row({ 'children' : [widget1, widget2] });
    var row2 = new Plot({ title: "Main plot", right_axis: true, left_axis: false });
    var widget3 = new Plot({ bottom_axis: false });
    var widget4 = new Plot({ bottom_axis: false, left_axis: false, title: "Some plots" });
    var widget5 = new Plot({ bottom_axis: false, left_axis: false, right_axis: true });
    var row3 = new Row({ 'children' : [widget3, widget4, widget5]});
    var widget6 = new Plot({ });
    var widget7 = new Plot({ left_axis: false, right_axis: true });
    var widget8 = new Plot({ left_axis: false });
    var row4 = new Row({ 'children' : [widget6, widget7, widget8]});

    var widget9 = new Plot({ bottom_axis: false, title: "Column 1" });
    var widget10 = new Plot({ });
    var column1 = new Column({ 'children' : [widget9, widget10] });
    var widget11 = new Plot({ left_axis: false, bottom_axis: false, title: "Column 2" });
    var widget12 = new Plot({ left_axis: false, right_axis: true });
    var column2 = new Column({ 'children' : [widget11, widget12] });
    var row5 = new Row({ 'children' : [column1, column2] });

    var root = new Column({ 'children' : [row1, row2, row3, row4, row5 ]});

    // var widget1 = new Plot({ title: "A plot" });
    // var widget2 = new Plot({ left_axis: false });
    // var widget3 = new Plot({ });
    // var widget4 = new Plot({ });
    // var row1 = new Row({ 'children' : [widget1, widget2, widget3, widget4 ] });
    // var widget9 = new Plot({ bottom_axis: false, title: "Column 1" });
    // var widget10 = new Plot({ left_axis: false, right_axis: true });
    // var column1 = new Column({ 'children' : [widget9, widget10] });
    // var widget11 = new Plot({ left_axis: false, right_axis: false });
    // var root = new Column({ 'children' : [ row1, column1, widget11 ]});
    //var root = column1;

    var rootView = new root.default_view({ 'model' : root });

    rootView.render();
    $("#toplevel").append(rootView.$el);
    root.set_dom_origin(0, 0);

    rootLayoutable = root;

    window.onresize = refresh;
    refresh();
}

window.onload = main;

// move stuff to views
// render cycle
// fake plots in demo / global constraints
