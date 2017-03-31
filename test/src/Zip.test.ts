/*global describe, it */
import "mocha";
import chai = require("chai");
const expect = chai.expect;
import Zip from "../../src/index";

describe("Class: `Zip`", () => {

	it("should be a class", () => {
		const zip = new Zip();
		expect(zip).to.be.an.instanceof(Zip);
	});

	it("should respond to 7-Zip commands as methods", () => {
		const zip = new Zip();
		expect(zip).to.respondTo("add");
		expect(zip).to.respondTo("delete");
		expect(zip).to.respondTo("extract");
		expect(zip).to.respondTo("extractFull");
		expect(zip).to.respondTo("list");
		expect(zip).to.respondTo("test");
		expect(zip).to.respondTo("update");
	});

});
