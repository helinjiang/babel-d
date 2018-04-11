'use strict';

var _babelCompile = require('./babel-compile');

var babelCompile = _interopRequireWildcard(_babelCompile);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var compileBabelD = babelCompile.compile;

compileBabelD.babelCompile = babelCompile;

module.exports = compileBabelD;
//# sourceMappingURL=index.js.map