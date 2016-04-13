var CellEditors, CellFormatters, Model, TableColumn, _, p,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require("underscore");

CellEditors = require("./cell_editors");

CellFormatters = require("./cell_formatters");

p = require("../../core/properties");

Model = require("../../model");

TableColumn = (function(superClass) {
  extend(TableColumn, superClass);

  function TableColumn() {
    return TableColumn.__super__.constructor.apply(this, arguments);
  }

  TableColumn.prototype.type = 'TableColumn';

  TableColumn.prototype.default_view = null;

  TableColumn.prototype.props = function() {
    return _.extend({}, TableColumn.__super__.props.call(this), {
      field: [p.String],
      title: [p.String],
      width: [p.Number, 300],
      formatter: [p.Instance, new CellFormatters.String.Model()],
      editor: [p.Instance, new CellEditors.String.Model()],
      sortable: [p.Bool, true],
      default_sort: [p.String, "ascending"]
    });
  };

  TableColumn.prototype.toColumn = function() {
    return {
      id: _.uniqueId(),
      field: this.get("field"),
      name: this.get("title"),
      width: this.get("width"),
      formatter: this.get("formatter"),
      editor: this.get("editor"),
      sortable: this.get("sortable"),
      defaultSortAsc: this.get("default_sort") === "ascending"
    };
  };

  return TableColumn;

})(Model);

module.exports = {
  Model: TableColumn
};
