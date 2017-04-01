import path = require("path");
import when = require("when");

import run from "../util/run";
import { ISwitches } from "../util/switches";

/**
 * Extract an archive with full paths.
 * @promise ExtractFull
 * @param {string} archive Path to the archive.
 * @param {string} dest Destination.
 * @param options {Object} An object of acceptable options to 7za bin.
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Extracted files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 */
export default function extract_full(archive: string, dest: string, options?: ISwitches): when.Deferred<string[]> {
	// return when.promise((resolve, reject)=> {
	const defer = when.defer<string[]>();

	// Create a string that can be parsed by `run`.
	const command = '7z x "' + archive + '" -o"' + dest + '" ';

	// Start the command
	run(command, options)

		// When a stdout is emitted, parse each line and search for a pattern. When
		// the pattern is found, extract the file (or directory) name from it and
		// pass it to an array. Finally returns this array.
		// Also check if a file is extracted using an Unsupported Method of 7-Zip.
		.promise.then((resolve_value) => {
			return defer.resolve(resolve_value);
		}, (reject_reason) => {
			return defer.reject(reject_reason);
		}, (progress_data) => {
			const isUnsupportedMethod = (progress_data.indexOf("Unsupported Method") !== -1)
				? true
				: false;
			if (isUnsupportedMethod) {
				return defer.reject(new Error("Unsupported Method"));
			}

			const entries: string[] = [];
			progress_data.split("\n").forEach((line: string) => {
				if (line.substr(0, 12) === "Extracting  ") {
					entries.push(line.substr(12, line.length).replace(path.sep, "/"));
				}
			});
			return defer.notify(entries);
		});

	return defer;
}