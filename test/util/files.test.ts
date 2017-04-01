/*global describe, it */
import "mocha";
import chai = require("chai");
const expect = chai.expect;
import files from "../../util/files";

describe("Utility: `files`", () => {

	it("should error on invalid files", () => {
		const r = files();
		expect(r.command).to.eql("");
	});

	it("should works with strings", () => {
		const r = files("hello test");
		expect(r.command).to.eql('"hello test"');
	});

	it("should works with arrays", () => {
		const r = files(["hello test", "hello world"]);
		expect(r.command.trim()).to.eql('"hello test" "hello world"');
	});

});
