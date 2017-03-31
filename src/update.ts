import path = require("path");
import when = require("when");
import run from "../util/run";
import { ISwitches } from "../util/switches";

/**
 * Update content to an archive.
 * @promise Update
 * @param archive {string} Path to the archive.
 * @param files {string} Files to add.
 * @param options {Object} An object of acceptables options to 7z bin.
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Listed files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 */
export default function update_archive(archive: string, files: string, options?: ISwitches): when.Deferred<string[]> {
	// return when.promise((resolve, reject, progress) =>  {
	const defer = when.defer<string[]>();

	// Create a string that can be parsed by `run`.
	const command = '7z u "' + archive + '" "' + files + '"';

	// Start the command
	run(command, options)

		// When a stdout is emitted, parse each line and search for a pattern. When
		// the pattern is found, extract the file (or directory) name from it and
		// pass it to an array. Finally returns this array.
		.promise.then((resolved_value) => {
			return defer.resolve();
		}, (reject_reason) => {
			return defer.reject(reject_reason);
		}, (progress_data) => {
			const entries: string[] = [];
			progress_data.split("\n").forEach((line: string) => {
				if (line.substr(0, 13) === "Compressing  ") {
					entries.push(line.substr(13, line.length).replace(path.sep, "/"));
				}
			});
			return defer.notify(entries);
		});
	return defer;
}
