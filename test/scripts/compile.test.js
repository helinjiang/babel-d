import path from 'path';
import { expect } from 'chai';

import compile from '../../lib';
import {getAll} from '../../lib/file';

describe('compile', () => {
    let srcPath = path.resolve(__dirname, '../data/fixtures');
    let outPath = path.resolve(__dirname, '../data/expected');

    let srcFiles;
    let outFiles;

    before((done) => {
        compile(srcPath, outPath);

        srcFiles = getAll(srcPath);
        outFiles = getAll(outPath);

        done()
    });

    it('should compile all files', () => {
        expect(outFiles).to.have.lengthOf(srcFiles.length);
    });

});
