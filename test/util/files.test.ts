/*global describe, it */
import 'mocha';
import chai = require('chai');
let expect = chai.expect;
import files  from '../../util/files';

describe('Utility: `files`', function () {

  it('should error on invalid files', function () {
    var r = files();
    expect(r).to.eql('');
  });

  it('should works with strings', function () {
    var r = files('hello test');
    expect(r).to.eql('"hello test"');
  });

  it('should works with arrays', function () {
    var r = files([ 'hello test', 'hello world' ]);
    expect(r).to.eql('"hello test" "hello world"');
  });

});
