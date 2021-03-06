import path = require("path");
import when = require("when");

import {parse_progress} from "../util/parse_progress";

import run from "../util/run";
import { ISwitches } from "../util/switches";

/**
 * Test integrity of archive.
 * @promise Test
 * @param archive {string} Path to the archive.
 * @param options {Object} An object of acceptable options to 7za bin.
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Extracted files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 */
export default function test_archive(archive: string, options?: ISwitches): when.Deferred<string[]> {
	const deferred = when.defer<string[]>();

	// Create a string that can be parsed by `run`.
	const command = '7z t "' + archive + '"';

	// Start the command
	run(command, options)

		// When a stdout is emitted, parse each line and search for a pattern. When
		// the pattern is found, extract the file (or directory) name from it and
		// pass it to an array. Finally returns this array.
		.promise.then((resolve_value) => {
			return deferred.resolve(resolve_value);
		}, (reject_reason) => {
			return deferred.reject(reject_reason);
		}, (progress_data) => {
			const entries = parse_progress(progress_data);
			return deferred.notify(entries);
		});
	return deferred;
}
