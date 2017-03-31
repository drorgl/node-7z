/*global describe, it */
import "mocha";
import chai = require("chai");
const expect = chai.expect;
import { options_object_to_array } from "../../util/switches";
const switches = options_object_to_array;

describe("Utility: `switches`", () => {

	it("should return deflaut flags with no args", () => {
		expect(switches({})).to.contain("-ssc");
		expect(switches({})).to.contain("-y");
	});

	it("should return -ssc with flag { ssc: true }", () => {
		expect(switches({ ssc: true })).to.contain("-ssc");
		expect(switches({ ssc: true })).to.contain("-y");
	});

	it("should return -ssc- with flag { ssc: false }", () => {
		expect(switches({ ssc: false })).to.contain("-ssc-");
	});

	it("should return non default booleans when specified", () => {
		const r = switches({
			so: true,
			spl: true,
			ssw: true,
			y: false
		});
		expect(r).to.contain("-so");
		expect(r).to.contain("-spl");
		expect(r).to.contain("-ssc");
		expect(r).to.contain("-ssw");
		expect(r).not.to.contain("-y");
	});

	it("should return complex values when needed", () => {
		const r = switches({
			ssc: true,
			ssw: true,
			mx0: true
		});
		expect(r).to.contain("-ssc");
		expect(r).to.contain("-ssw");
		expect(r).to.contain("-mx0");
		expect(r).to.contain("-y");
	});

	it("should return complex values with spaces and quotes", () => {
		const r = switches({
			ssc: true,
			ssw: true,
			m0: "=BCJ",
			m1: "=LZMA:d=21",
			p: "My Super Pasw,àù£*",
		});
		expect(r).to.contain("-ssc");
		expect(r).to.contain("-ssw");
		expect(r).to.contain("-m0=BCJ");
		expect(r).to.contain("-m1=LZMA:d=21");
		expect(r).to.contain('-p"My Super Pasw,àù£*"');
		expect(r).to.contain("-y");
	});

	it("should works with the `raw` switch", () => {
		const r = switches({
			raw: ["-i!*.jpg", "-i!*.png"],
		});
		expect(r).to.contain("-i!*.jpg");
		expect(r).to.contain("-i!*.png");
	});

});
