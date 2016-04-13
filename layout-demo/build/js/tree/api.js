var _;

_ = require("underscore");

module.exports = {
  LinAlg: require("./api/linalg"),
  Plotting: require("./api/plotting"),
  Document: require("./document").Document
};

_.extend(module.exports, require("./api/models"));
