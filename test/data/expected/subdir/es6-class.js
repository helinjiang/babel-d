"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
    function _class(name) {
        (0, _classCallCheck3.default)(this, _class);

        this.name = name;
    }

    _class.prototype.sayHello = function sayHello() {
        console.log("Hello, " + this.name + "!");
    };

    return _class;
}();

exports.default = _class;