const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const fileUtil = require('./file');

//babel not export default property
//so can not use `import babel from 'babel-core'`
const babel = require('babel-core');

let allowFileExt = ['.js'];

/**
 * store compiled files last mtime
 * @type {Object}
 */
let compiledMtime = {};

/**
 * compiled error files
 * @type {Array}
 */
let compiledErrorFiles = [];

/**
 * compile files
 * @return {} []
 */
export function compile(srcPath, outPath) {
  let files = getFiles(srcPath, true);

  let changedFiles = [];

  console.log(files);

  files.forEach(file => {
    let srcFullPath = path.join(srcPath, file);
    let saveOutFullPathpath = path.join(outPath, file);

    let extname = path.extname(file);

    //if is not js file, only copy
    if (allowFileExt.indexOf(extname) === -1) {
      compileFile(srcFullPath, saveOutFullPathpath, true);
      return;
    }

    let mTime = fs.statSync(srcFullPath).mtime.getTime();

    if (fileUtil.isFile(saveOutFullPathpath)) {
      let outmTime = fs.statSync(saveOutFullPathpath).mtime.getTime();

      // if compiled file mtime is later than source file,
      // it means source file not modified, so there is no necessary to compile.
      if (outmTime >= mTime) {
        return;
      }
    }

    if (!compiledMtime[file] || mTime > compiledMtime[file]) {
      let ret = compileFile(srcFullPath, saveOutFullPathpath);

      if (ret) {
        changedFiles.push(saveOutFullPathpath);
      }

      compiledMtime[file] = mTime;

      let index = compiledErrorFiles.indexOf(file);

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
export function compileFile(srcFullPath, saveOutFullPath, onlyCopy) {
  let content = fs.readFileSync(srcFullPath, 'utf8');

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
    let startTime = Date.now();

    let data = compileByBabel(content, {
      filename: srcFullPath
      // sourceMaps: true,
      // sourceFileName: relativePath
    });

    let endTime = Date.now();
    console.log(`Compile file ${srcFullPath}`, `Babel cost ${endTime - startTime}`);

    // save file
    fse.outputFileSync(saveOutFullPath, data.code);

    return true;
  } catch (e) {
    console.error(`compile file ${srcFullPath} error`, e);
  }

  return false;
}

/**
 * babel compile
 * https://babeljs.io/docs/core-packages/#babeltransformcode-string-options-object
 * @return {} []
 */
export function compileByBabel(content, options) {
  return babel.transform(content, Object.assign({
    presets: ['es2015-loose', 'stage-1'],
    plugins: ['transform-runtime']
  }, options));
}

/**
 * get all files
 * @param paths
 */
export function getFiles(paths) {
  let result = fileUtil.getAllFiles(paths);

  let files = result.map((item) => {
    return item.relativePath;
    // return path.join(item.basePath, item.relativePath);
  });

  return files;
}
