/*global describe, it */
import 'mocha';
import chai = require('chai');
let expect = chai.expect;
import fs = require('fs-extra');
import update from '../../src/update';

describe('Method: `Zip.update`', function () {

  it('should return an error on 7z error', function (done) {
    update('.tmp/test/addnot.7z', '.tmp/test/nothere', { '???': true })
      .promise.catch((err) => {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

  it('should return entries on progress', function (done) {
    fs.copySync('test/zip.7z', '.tmp/test/update.7z');
    update('.tmp/test/update.7z', '*.md', { w: 'test' })
      .promise.then(null, null, (entries) => {
        expect(entries.length).to.be.at.least(1);
        done();
      });
  });

  it('should return on fulfillment', function (done) {
    fs.copySync('test/zip.7z', '.tmp/test/update.7z');
    update('.tmp/test/update.7z', '*.txt')
      .promise.then(function () {
        done();
      });
  });

});
