/*global describe, it */
import "mocha";
import chai = require("chai");
const expect = chai.expect;
import child_process = require("child_process");
const exec = child_process.execSync;
import add from "../../src/add";
import fs = require("fs");
import path = require("path");

// List all files in a directory in Node.js recursively in a synchronous fashion
function walkSync(dir: string): string[] {
	let filelist: string[] = [];
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		if (fs.statSync(dir + "/" + file).isDirectory()) {
			filelist = filelist.concat(walkSync(dir + "/" + file));
		} else {
			filelist.push(dir + "/" + file);
		}
	});
	return filelist;
}

describe("Method: `Zip.add`", () => {

	it("should return an error on 7z error", (done) => {
		add(".tmp/test/addnot.7z", ".tmp/test/nothere", { "???": true })
			.promise.catch((err) => {
				expect(err).to.be.an.instanceof(Error);
				done();
			});
	});

	it("should return entries on progress", (done) => {
		add(".tmp/test/add.zip", "*.md")
			.promise.then(null,
			(reject_reason) => {
				done();
			}, (progress_data) => {
				expect(progress_data.length).to.be.at.least(1);
				done();
			});
	});

	it("should accept array as source", (done) => {
		const store: string[] = [];
		add(".tmp/test/add.zip", ["*.md", "*.js"])
			.promise.then((resolve_value) => {
				expect(store.length).to.be.at.least(4);
				done();
			},
			null,
			(progress_data) => {
				progress_data.forEach((e: string) => {
					store.push(e);
				});
			});
	});

	it("should accept many files as source", (done) => {
		const store: string[] = [];
		const files = walkSync("./test/many_files").map((v) => path.join("./", v));
		add(".tmp/test/add.7z", files)
			.promise.then((resolve_value) => {
				expect(store.length).to.be.at.least(60);
				done();
			},
			null,
			(progress_data) => {
				progress_data.forEach((e: string) => {
					store.push(e);
				});
			});
	});

	it("should accept a path", (done) => {
		add(".tmp/test/add.zip", "*.md", {
			path: "/usr/local/bin/7z"
		})
			.promise.then(null, null, (progress_data) => {
				expect(progress_data.length).to.be.at.least(1);
				done();
			});
	});

});
