'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compile = compile;
exports.compileFile = compileFile;
exports.compileByBabel = compileByBabel;
exports.getFiles = getFiles;
var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');
var fileUtil = require('./file');

//babel not export default property
//so can not use `import babel from 'babel-core'`
var babel = require('babel-core');

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
 * compile files
 *
 * @param {String} srcPath
 * @param {String} outPath
 * @param {Object} [options]
 * @param {String} [options.debug] only for debug
 */
function compile(srcPath, outPath) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (options.debug) {
    console.log('\nBegin compile...', srcPath, outPath, options);
  }

  var files = getFiles(srcPath, true);

  var changedFiles = [];

  if (options.debug) {
    console.log('all files:', files);
  }

  files.forEach(function (file) {
    var srcFullPath = path.join(srcPath, file);
    var saveOutFullPathpath = path.join(outPath, file);
    var extname = path.extname(file);

    if (options.debug) {
      console.log('[' + extname + '] ' + srcFullPath + ' => ' + saveOutFullPathpath);
    }

    //if is not js file, only copy
    if (allowFileExt.indexOf(extname) === -1) {
      compileFile(srcFullPath, saveOutFullPathpath, true, options);
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
      var ret = compileFile(srcFullPath, saveOutFullPathpath, false, options);

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
 *
 * @param {String} srcFullPath
 * @param {String} saveOutFullPath
 * @param {Boolean} [onlyCopy]
 * @param {Object} [options]
 * @param {String} [options.debug] only for debug
 */
function compileFile(srcFullPath, saveOutFullPath, onlyCopy) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var content = fs.readFileSync(srcFullPath, 'utf8');

  //when get file content empty, maybe file is locked
  if (!content) {
    return;
  }

  // only copy file content
  if (onlyCopy) {
    fse.copySync(srcFullPath, saveOutFullPath);
    return;
  }

  try {
    var startTime = Date.now();

    var data = compileByBabel(content, {
      filename: srcFullPath
      // sourceMaps: true,
      // sourceFileName: relativePath
    });

    var endTime = Date.now();

    if (options.debug) {
      console.log('Compile file ' + srcFullPath, 'Babel cost ' + (endTime - startTime) + ' ms');
    }

    // save file
    fse.outputFileSync(saveOutFullPath, data.code);

    return true;
  } catch (e) {
    console.error('compile file ' + srcFullPath + ' error', e);
  }

  return false;
}

/**
 * babel compile
 * https://babeljs.io/docs/core-packages/#babeltransformcode-string-options-object
 * @return {} []
 */
function compileByBabel(content, options) {
  return babel.transform(content, Object.assign({
    presets: ['es2015-loose', 'stage-1'],
    plugins: ['transform-runtime']
  }, options));
}

/**
 * get all files
 * @param paths
 */
function getFiles(paths) {
  var result = fileUtil.getAllFiles(paths);

  var files = result.map(function (item) {
    return item.relativePath;
    // return path.join(item.basePath, item.relativePath);
  });

  return files;
}
//# sourceMappingURL=babel-compile.js.map