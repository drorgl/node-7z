/*global describe, it */
import 'mocha';
import chai = require('chai');
let expect = chai.expect;
import fs      = require('fs-extra');
import extract from '../../src/extract';

describe('Method: `Zip.extract`', function () {

  it('should return an error on 7z error', function (done) {
    extract('test/nothere.7z', '.tmp/test')
    .promise.catch((err)=> {
      expect(err).to.be.an.instanceof(Error);
      done();
    });
  });

  it('should return an error on output duplticate', function (done) {
    extract('test/zip.7z', '.tmp/test', { o: '.tmp/test/duplicate' })
    .promise.catch((err)=> {
      expect(err).to.be.an.instanceof(Error);
      done();
    });
  });

  it('should return entries on progress', function (done) {
    extract('test/zip.7z', '.tmp/test')
    .promise.then(null,null,(entries)=> {
      expect(entries.length).to.be.at.least(1);
      done();
    });
  });

  it('should extract on the right path', function (done) {
    extract('test/zip.7z', '.tmp/test')
    .promise.then( ()=> {
      expect(fs.existsSync('.tmp/test/file0.txt')).to.be.eql(true);
      expect(fs.existsSync('.tmp/test/file1.txt')).to.be.eql(true);
      expect(fs.existsSync('.tmp/test/file2.txt')).to.be.eql(true);
      expect(fs.existsSync('.tmp/test/file3.txt')).to.be.eql(true);
      done();
    });
  });

  it('should return a countable list of files on progress', function (done) {
    var filesNumber = 0
    extract('test/zip.7z', '.tmp/test2')
    .promise.then(null,null, (entries : string[])=> {
      filesNumber += entries.length;
    })
    .then(function () {
      expect(filesNumber).to.be.equal(6);
      done();
    });
  });

});
