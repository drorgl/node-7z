/*global describe, it */
import 'mocha';
import chai = require('chai');
let expect = chai.expect;
import fs = require('fs-extra');
//import fs = require("fs");
import del from '../../src/delete';
import extract from '../../src/extractFull';

describe('Method: `Zip.delete`', function () {

  it('should return an error on 7z error', function (done) {
    del('.tmp/test/addnot.7z', '.tmp/test/nothere', { '???': true })
      .promise.catch((reject_reason) => {
        expect(reject_reason).to.be.an.instanceof(Error);
        done();
      })
  });

  it('should return on fulfillment', function (done) {
    fs.copySync('test/zip.7z', '.tmp/test/copy.7z');
    del('.tmp/test/copy.7z', '*.txt')
      .promise.done((resolve_value) => {
        done();
      })
  });

  it('should accept array as source', function (done) {
    fs.copySync('test/zip.7z', '.tmp/d.7z');
    del('.tmp/d.7z', [
      'zip/file0.txt',
      'zip/file1.txt',
    ])
      .promise.done(() => {
        extract('.tmp/d.7z', '.tmp/d').promise.done(() => {
          var files = fs.readdirSync('.tmp/d/zip');
          expect(files).not.to.contain('file0.txt');
          expect(files).not.to.contain('file1.txt');
          expect(files).to.contain('file2.txt');
          expect(files).to.contain('folder');
          done();
        });
      });
  });

});
