/*global describe, it */
import 'mocha';
import chai = require('chai');
let expect = chai.expect;
import test from '../../src/test';

describe('Method: `Zip.test`', function () {

  it('should return an error on 7z error', function (done) {
    test('test/nothere.7z')
      .promise.catch((err) => {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

  it('should return entries on progress', function (done) {
    test('test/zip.7z', { r: true })
      .promise.then(null, null, (entries) => {
        expect(entries.length).to.be.at.least(1);
        done();
      });
  });

});
