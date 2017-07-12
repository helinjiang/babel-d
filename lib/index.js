'use strict';

var _babelCompile = require('./babel-compile');

module.exports = function (srcPath, outPath) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  (0, _babelCompile.compile)(srcPath, outPath);
};
//# sourceMappingURL=index.js.map