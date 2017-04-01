import path = require("path");
import when = require("when");

import transform_files from "../util/files";
import run from "../util/run";
import { ISwitches } from "../util/switches";

import fs = require("fs");
// path    : require('../util/path'),

/**
 * Add content to an archive.
 * @promise Add
 * @param archive {string} Path to the archive.
 * @param files {string|array} Files to add.
 * @param options {Object} An object of acceptable options to 7za bin.
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Listed files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 */
export default function add_to_archive(archive: string, files_: string[] | string, options?: ISwitches): when.Deferred<string[]> {
	// return when.promise<string[]>((resolve, reject)=> {
	const deferred = when.defer<string[]>();

	// Convert array of files into a string if needed.
	const files = transform_files(files_);

	const command = '7z a "' + archive + '" ' + ((files.filename) ? "" : files.command); // + files.command;

	if (files.filename) {
		options = Object.assign({}, options);
		options[`ir@${files.filename}`] = true;
	}

	// Start the command
	run(command, options)
		.promise.then((resolve_value) => {
			return deferred.resolve(resolve_value);
		}, (reject_reason) => {
			return deferred.reject(reject_reason);
		}, (progress_data) => {
			// When a stdout is emitted, parse each line and search for a pattern. When
			// the pattern is found, extract the file (or directory) name from it and
			// pass it to an array. Finally returns this array in the progress function.
			const entries: string[] = [];
			progress_data.split("\n").forEach((line: string) => {
				if (line.substr(0, 13) === "Compressing  ") {
					entries.push(line.substr(13, line.length).replace(path.sep, "/"));
				}
			});
			return deferred.notify(entries);
		}).finally(() => {
			if (files.filename) {
				fs.unlinkSync(files.filename);
			}
		});

	return deferred;
}
