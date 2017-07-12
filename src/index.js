import { compile } from './babel-compile';

module.exports = (srcPath, outPath, options = {}) => {
  compile(srcPath, outPath, options);
};