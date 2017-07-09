'use strict';

exports.__esModule = true;
exports.default = run;

var _babelCompile = require('./babel-compile');

var fs = require('fs');
var path = require('path');

var _ = require('lodash');


// const Compile = require('./compile');
//
// const rootPath = path.dirname(__dirname);
//
// const globalOpts = {
//     APP_PATH: rootPath + path.sep + 'app',
//     RUNTIME_PATH: rootPath + path.sep + 'runtime',
//     ROOT_PATH: rootPath,
//     RESOURCE_PATH: __dirname,
//     UPLOAD_PATH: path.join(__dirname, 'static/upload'),
//     env: 'development',
//
// };

// export default function compile(srcPath, outPath, options = {}) {
//     if (_.isPlainObject(srcPath)) {
//         options = srcPath;
//         srcPath = '';
//     } else if (srcPath === true) {
//         options = { log: true };
//         srcPath = '';
//     }
//
//     // 源代码的文件夹路径
//     srcPath = srcPath || path.join(globalOpts.ROOT_PATH, 'src');
//
//     // 如果源代码的文件夹路径地址不是文件，则直接返回不处理了。
//     if (!isDirectory(srcPath)) {
//         console.error(`${srcPath} is not directory!`);
//         return;
//     }
//
//     // 编译后的文件夹路径
//     outPath = outPath || globalOpts.APP_PATH;
//
//     let instance = new Compile(srcPath, outPath, options, (changedFiles) => {
//         console.log('compileCallback', changedFiles)
//     });
//
//     instance.run();
// }

function run(srcPath, outPath) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    (0, _babelCompile.compile)(srcPath, outPath);
}

// function isDirectory(paths) {
//     return fs.lstatSync(paths).isDirectory();
// }
//# sourceMappingURL=index.js.map