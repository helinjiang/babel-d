'use strict';

exports.__esModule = true;
exports.compile = compile;
var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');
var fileUtil = require('./file');

var allowFileExt = ['.js'];

/**
 * store compiled files last mtime
 * @type {Object}
 */
var compiledMtime = {};

/**
 * compiled error files
 * @type {Array}
 */
var compiledErrorFiles = [];

/**
 * compile
 * @return {} []
 */
function compile(srcPath, outPath) {
    var files = getFiles(srcPath, true);

    var changedFiles = [];

    console.log(files);

    files.forEach(function (file) {
        var srcFullPath = path.join(srcPath, file);
        var saveOutFullPathpath = path.join(outPath, file);

        var extname = path.extname(file);

        //if is not js file, only copy
        if (allowFileExt.indexOf(extname) === -1) {
            compileFile(srcFullPath, saveOutFullPathpath, true);
            return;
        }

        var mTime = fs.statSync(srcFullPath).mtime.getTime();

        if (fileUtil.isFile(saveOutFullPathpath)) {
            var outmTime = fs.statSync(saveOutFullPathpath).mtime.getTime();

            // if compiled file mtime is later than source file,
            // it means source file not modified, so there is no necessary to compile.
            if (outmTime >= mTime) {
                return;
            }
        }

        if (!compiledMtime[file] || mTime > compiledMtime[file]) {
            var ret = compileFile(srcFullPath, saveOutFullPathpath);

            if (ret) {
                changedFiles.push(saveOutFullPathpath);
            }

            compiledMtime[file] = mTime;

            var index = compiledErrorFiles.indexOf(file);

            if (ret) {
                if (index > -1) {
                    compiledErrorFiles.splice(index, 1);
                }
            } else if (ret === false) {
                if (index === -1) {
                    compiledErrorFiles.push(file);
                }
            }
        }
    });

    // console.error(compiledErrorFiles)
}

/**
 * compile single file
 * @param  {String} file     []
 * @param  {Boolean} [onlyCopy] []
 * @return {}          []
 */
function compileFile(srcFullPath, saveOutFullPath, onlyCopy) {
    var content = fs.readFileSync(srcFullPath, 'utf8');

    //when get file content empty, maybe file is locked
    if (!content) {
        return;
    }

    // only copy file content
    if (onlyCopy) {
        fse.outputFileSync(saveOutFullPath, content);
        return;
    }

    try {
        compileByBabel(content, srcFullPath, saveOutFullPath);
        return true;
    } catch (e) {
        console.error('compile file ' + srcFullPath + ' error', e);
    }

    return false;
}

/**
 * babel compile
 * @return {} []
 */
function compileByBabel(content, srcFullPath, saveOutFullPath) {
    var startTime = Date.now();

    //babel not export default property
    //so can not use `import babel from 'babel-core'`
    var babel = require('babel-core');
    var data = babel.transform(content, {
        filename: srcFullPath,
        presets: ['es2015-loose', 'stage-1'],
        plugins: ['transform-runtime']
        // sourceMaps: true,
        // sourceFileName: relativePath
    });

    console.log('Compile file ' + srcFullPath, 'Babel', startTime);

    fse.outputFileSync(saveOutFullPath, data.code);
}

function getFiles(paths) {
    var files = [];

    var result = fileUtil.getAllFiles(paths);

    files = result.map(function (item) {
        return item.relativePath;
        // return path.join(item.basePath, item.relativePath);
    });

    return files;
}
//# sourceMappingURL=babel-compile.js.map