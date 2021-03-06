/*global describe, it */
import "mocha";
import chai = require("chai");
const expect = chai.expect;
import list from "../../src/list";

describe("Method: `Zip.list`", () => {

	it("should return an error on 7z error", (done) => {
		list("test/nothere.7z")
			.promise.catch((err) => {
				expect(err).to.be.an.instanceof(Error);
				done();
			});
	});

	it("should return an tech spec on fulfill", (done) => {
		list("test/zip.7z", { r: true })
			.promise.then((spec) => {
				expect(spec).to.have.property("path");
				expect(spec).to.have.property("type");
				expect(spec).to.have.property("method");
				expect(spec).to.have.property("physicalSize");
				expect(spec).to.have.property("headersSize");
				done();
			});
	});

	it("should return valid entries on progress", (done) => {
		list("test/zip.zip")
			.promise.then(null, null, (entries) => {
				expect(entries.length).to.be.at.least(1);
				expect(entries[0].date).to.be.an.instanceof(Date);
				expect(entries[0].attr.length).to.eql(5);
				expect(entries[0].name).to.be.a("string");
				expect(entries[0].name).to.not.contain("\\");
				done();
			});
	});

	it('should not ignore files with blank "Compressed" columns', (done) => {
		list("test/blank-compressed.7z")
			.promise.then(null, null, (files) => {
				expect(files.length).to.be.eql(8);
				done();
			});
	});

	it("should not ignore read-only, hidden and system files", () => {
		// tslint:disable-next-line:prefer-const
		let files: string[] = [];
		return list("test/attr.7z").promise.then(null, null, (chunk) => {
			[].push.apply(files, chunk);
		}).then(() => {
			expect(files.length).to.be.eql(9);
		});
	});

});
