/*global describe, it */
import "mocha";
import chai = require("chai");
const expect = chai.expect;
import exec = require("child_process");
import path from "../../util/path";

describe("Utility: `path`", () => {

	it("should return deflaut flags with no args", () => {
		if (process.platform === "win32") {
			const pathInSystem = exec.execSync("where 7z").toString();
		} else {
			const pathInSystem = exec.execSync("which 7z").toString();
		}
	});

});
