var Box, Row,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Box = require("./box");

Row = (function(superClass) {
  extend(Row, superClass);

  Row.prototype.type = 'Row';

  function Row(attrs, options) {
    Row.__super__.constructor.call(this, attrs, options);
    this._horizontal = true;
  }

  return Row;

})(Box.Model);

module.exports = {
  Model: Row
};
