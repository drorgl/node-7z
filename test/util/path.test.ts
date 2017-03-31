/*global describe, it */
import 'mocha';
import chai = require('chai');
let expect = chai.expect;
import exec = require('child_process');
import path from '../../util/path';

describe('Utility: `path`', function () {

  it('should return deflaut flags with no args', function () {
    var pathInSystem = exec.execSync('which 7z').toString();
  });
	
});