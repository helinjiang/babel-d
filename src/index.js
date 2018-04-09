import * as babelCompile from './babel-compile';

const compileBabelD = babelCompile.compile;

compileBabelD.babelCompile = babelCompile;

module.exports = compileBabelD;