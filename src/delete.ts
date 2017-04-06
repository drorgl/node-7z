import when = require("when");

import transform_files from "../util/files";
import run from "../util/run";
import { ISwitches } from "../util/switches";

import fs = require("fs");

/**
 * Delete content to an archive.
 * @promise Delete
 * @param archive {string} Path to the archive.
 * @param files {string|array} Files to add.
 * @param options {Object} An object of acceptable options to 7za bin.
 * @resolve {array} Arguments passed to the child-process.
 * @reject {Error} The error as issued by 7-Zip.
 */
export default function delete_from_archive(archive: string, files_: string[] | string, options?: ISwitches): when.Deferred<string[]> {
	// return when.promise(function (resolve, reject) {
	const defer = when.defer<string[]>();

	// Convert array of files into a string if needed.
	const files = transform_files(files_);

	// Create a string that can be parsed by `run`.
	const command = '7z d "' + archive + '" ' + ((files.filename) ? "" : files.command);

	if (files.filename) {
		options = Object.assign({}, options);
		options[`i@${files.filename}`] = true;
	}

	// Start the command
	run(command, options)
		.promise.then((resolve_value) => {
			return defer.resolve(resolve_value);
		}, (reject_reason) => {
			return defer.reject(reject_reason);
		}).finally(() => {
			if (files.filename) {
				fs.unlinkSync(files.filename);
			}
		});

	return defer;
}
