'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = sayHello;
function sayHello(name) {

  var target = {
    age: 12,
    desc: 'i like desc'
  };

  var result = _extends({}, target);

  result.tName = name;

  var _result = result,
      tName = _result.tName;


  var wording = 'Hello, ' + tName + '!';

  result = Object.assign({}, result, {
    wording: wording
  });

  console.log('Hello, ' + name + '!', result);
}

sayHello('world');