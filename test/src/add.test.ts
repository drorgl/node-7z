/*global describe, it */
import 'mocha';
import chai = require('chai');
let expect = chai.expect;
var exec = require('child_process').execSync;
import add from '../../src/add';

describe('Method: `Zip.add`', function () {

  it('should return an error on 7z error', function (done) {
    add('.tmp/test/addnot.7z', '.tmp/test/nothere', { '???': true })
      .promise.catch(function (err) {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

  it('should return entries on progress', function (done) {
    add('.tmp/test/add.zip', '*.md')
      .promise.then((resolve_value) => {

      }, (reject_reason) => {
        done();
      }, (progress_data) => {
        expect(progress_data.length).to.be.at.least(1);
        done();
      });
  });

  it('should accept array as source', function (done) {
    var store: string[] = [];
    add('.tmp/test/add.zip', ['*.md', '*.js'])
      .promise.then((resolve_value) => {
        expect(store.length).to.be.at.least(4);
        done();
      }, (reject_reason) => {

      }, (progress_data) => {
        progress_data.forEach((e: string) => {
          store.push(e);
        });
      });
  });

  it('should accept a path', function (done) {
    add('.tmp/test/add.zip', '*.md', {
      path: '/usr/local/bin/7z'
    })
      .promise.then((resolve_value) => {

      }, (reject_reason) => {

      }, (progress_data) => {
        expect(progress_data.length).to.be.at.least(1);
        done();
      })
  });

});
