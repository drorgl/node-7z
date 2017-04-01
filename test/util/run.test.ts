/*global describe, it */
import "mocha";
import chai = require("chai");
const expect = chai.expect;
import run from "../../util/run";
import path = require("path");

describe("Utility: `run`", () => {

	it("should return an error with invalid command type", (done) => {
		run(0 as any as string).promise.catch((err) => {
			expect(err.message).to.eql("Command must be a string");
			done();
		});
	});

	it("should return an error on when 7z gets one", (done) => {
		run('7z "???"').promise.catch((err) => {
			expect(err.message).to.eql("Incorrect command line");
			done();
		});
	});

	it("should return an stdout on progress", (done) => {
		run("7z", { h: true })
			.promise.then((resolve_value) => {
				done();
			},
			null,
			(progress_data) => {
				expect(progress_data).to.be.a("string");
			});
	});

	it("should correctly parse complex commands", (done) => {
		run('7z a ".tmp/test/archive.7z" "*.exe" "*.dll"', {
			m0: "=BCJ",
			m1: "=LZMA:d=21"
		})
			.promise.then((res) => {
				expect(res).to.contain("a");
				expect(res).to.contain(".tmp" + path.sep + "test" + path.sep + "archive.7z");
				expect(res).to.contain("*.exe");
				expect(res).to.contain("*.dll");
				expect(res).to.contain("-m0=BCJ");
				expect(res).to.contain("-m1=LZMA:d=21");
				expect(res).to.contain("-ssc");
				expect(res).to.contain("-y");
				done();
			});
	});

	it("should correctly parse complex commands with spaces", (done) => {
		run('7z a ".tmp/Folder A/Folder B\\archive.7z" "*.exe" "*.dll"', {
			m0: "=BCJ",
			m1: "=LZMA:d=21",
			p: "My mhjls/\\c $^é5°",
		})
			.promise.then((res) => {
				expect(res).to.contain("a");
				/*jshint maxlen:false*/
				expect(res).to.contain(".tmp" + path.sep + "Folder A" + path.sep + "Folder B" + path.sep + "archive.7z");
				expect(res).to.contain("*.exe");
				expect(res).to.contain("*.dll");
				expect(res).to.contain("-m0=BCJ");
				expect(res).to.contain("-m1=LZMA:d=21");
				expect(res).to.contain('-p"My mhjls/\\c $^é5°"');
				expect(res).to.contain("-ssc");
				expect(res).to.contain("-y");
				done();
			});
	});

	it("should handle error when the command could not be found", (done) => {
		run('7zxxx a ".tmp/test/archive.7z" "*.exe" "*.dll"').promise.catch((err) => {
			expect(err.message).to.contain("ENOENT");
			done();
		});
	});

});
