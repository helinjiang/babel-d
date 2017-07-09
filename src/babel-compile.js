const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const fileUtil = require('./file');
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
 * compile
 * @return {} []
 */
export function compile(srcPath, outPath) {
    // let srcPath, outPath;

    let files = getFiles(srcPath, true);
    let appFiles = getFiles(outPath, true);

    let changedFiles = [];

    console.log(files)

    files.forEach(file => {
        let extname = path.extname(file);

        //if is not js file, only copy
        if (allowFileExt.indexOf(extname) === -1) {
            // compileFile(file, true, srcPath, outPath);
            return;
        }

        let srcFullPath = path.join(srcPath, file);
        let saveOutFullPathpath = path.join(outPath, file);

        let mTime = fs.statSync(srcFullPath).mtime.getTime();

        if (fileUtil.isFile(saveOutFullPathpath)) {
            let outmTime = fs.statSync(saveOutFullPathpath).mtime.getTime();

            //if compiled file mtime is after than source file, return
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

    //notify auto reload service to clear file cache
    // if (changedFiles.length && this.callback) {
    //     this.callback(changedFiles);
    // }

    // if (!once) {
    //     setTimeout(compile.bind(this), 100);
    // }
}

/**
 * compile single file
 * @param  {String} file     []
 * @param  {Boolean} [onlyCopy] []
 * @return {}          []
 */
function compileFile(srcFullPath, saveOutFullPath, onlyCopy) {
    let content = fs.readFileSync(srcFullPath, 'utf8');

    //when get file content empty, maybe file is locked
    if (!content) {
        return;
    }

    // only copy file content
    // if (onlyCopy) {
    //     let saveFilepath = `${outPath}${path.sep}${file}`;
    //
    //     // mkdir
    //     mkdir(path.dirname(saveFilepath));
    //
    //     fs.writeFileSync(saveFilepath, content);
    //     return;
    // }

    try {
        compileByBabel(content, srcFullPath, saveOutFullPath);
        return true;
    } catch (e) {
        console.error(`compile file ${srcFullPath} error`, e);
    }

    return false;
}

/**
 * babel compile
 * @return {} []
 */
function compileByBabel(content, srcFullPath, saveOutFullPath) {
    let startTime = Date.now();

    //babel not export default property
    //so can not use `import babel from 'babel-core'`
    let babel = require('babel-core');
    let data = babel.transform(content, {
        filename: srcFullPath,
        presets: ['es2015-loose', 'stage-1'],
        plugins: ['transform-runtime'],
        // sourceMaps: true,
        // sourceFileName: relativePath
    });

    console.log(`Compile file ${srcFullPath}`, 'Babel', startTime);

    fse.outputFileSync(saveOutFullPath, data.code);
}

/**
 * merge source map
 * @param  {String} content        []
 * @param  {Object} orginSourceMap []
 * @param  {Object} sourceMap      []
 * @return {}                []
 */
// function mergeSourceMap(orginSourceMap, sourceMap) {
//     let { SourceMapGenerator, SourceMapConsumer } = require('source-map');
//
//     sourceMap.file = sourceMap.file.replace(/\\/g, '/');
//     sourceMap.sources = sourceMap.sources.map(filePath => {
//         return filePath.replace(/\\/g, '/');
//     });
//
//     var generator = SourceMapGenerator.fromSourceMap(new SourceMapConsumer(sourceMap));
//     generator.applySourceMap(new SourceMapConsumer(orginSourceMap));
//     sourceMap = JSON.parse(generator.toString());
//
//     return sourceMap;
// }

// function getRelationPath(file){
//     //use dirname to resolve file path in source-map-support
//     //so must use dirname in here
//     let pPath = path.dirname(this.outPath + think.sep + file);
//     return path.relative(pPath, this.srcPath + think.sep + file);
// }

function mkdir(dir) {
    fse.mkdirsSync(dir);
}

function getFiles(paths) {
    let files = [];

    let result = fileUtil.getAll(paths);

    files = result.map((item) => {
        return item.relativePath;
        // return path.join(item.basePath, item.relativePath);
    });

    return files;
}
