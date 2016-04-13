var Box, Column,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Box = require("./box");

Column = (function(superClass) {
  extend(Column, superClass);

  Column.prototype.type = 'Column';

  function Column(attrs, options) {
    Column.__super__.constructor.call(this, attrs, options);
    this._horizontal = false;
  }

  return Column;

})(Box.Model);

module.exports = {
  Model: Column
};
