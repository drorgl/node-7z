/*global describe, it */
import "mocha";
import chai = require("chai");
const expect = chai.expect;
import fs = require("fs-extra");
import extract from "../../src/extract";

describe("Method: `Zip.extract`", () => {

	it("should return an error on 7z error", (done) => {
		extract("test/nothere.7z", ".tmp/test")
			.promise.catch((err) => {
				expect(err).to.be.an.instanceof(Error);
				done();
			});
	});

	it("should return an error on output duplticate", (done) => {
		extract("test/zip.7z", ".tmp/test", { o: ".tmp/test/duplicate" })
			.promise.catch((err) => {
				expect(err).to.be.an.instanceof(Error);
				done();
			});
	});

	it("should return entries on progress", (done) => {
		extract("test/zip.7z", ".tmp/test")
			.promise.then(null, null, (entries) => {
				expect(entries.length).to.be.at.least(1);
				done();
			});
	});

	it("should extract on the right path", (done) => {
		extract("test/zip.7z", ".tmp/test")
			.promise.then(() => {
				expect(fs.existsSync(".tmp/test/file0.txt")).to.be.eql(true);
				expect(fs.existsSync(".tmp/test/file1.txt")).to.be.eql(true);
				expect(fs.existsSync(".tmp/test/file2.txt")).to.be.eql(true);
				expect(fs.existsSync(".tmp/test/file3.txt")).to.be.eql(true);
				done();
			});
	});

	it("should return a countable list of files on progress", (done) => {
		let filesNumber = 0;
		extract("test/zip.7z", ".tmp/test2")
			.promise.then(null, null, (entries: string[]) => {
				filesNumber += entries.length;
			})
			.then(() => {
				expect(filesNumber).to.be.equal(6);
				done();
			});
	});

});
