import os = require("os");
import path = require("path");
import crypto = require("crypto");
import fs = require("fs");

export interface ITransformInfo {
	command: string;
	filename?: string;
}

/**
 * Transform a list of files that can be an array or a string into a string
 * that can be passed to the `run` function as part of the `command` parameter.
 * @param  {string|array} files
 * @return {string}
 */
export default function transform(files?: string[] | string): ITransformInfo {
	if (files === undefined) {
		return { command: "" };
	}

	if (files instanceof Array) {
		if (files.length > 20) {
			const include_filename_tmp = get_temp_filename();
			fs.writeFileSync(include_filename_tmp, files.join(os.EOL));
			// -ir@"files_to_include.txt"
			return {
				command: ` -ir\@\"${include_filename_tmp}\" `,
				filename: include_filename_tmp
			};
		} else {
			let toProcess = "";
			files.forEach((f) => {
				toProcess += '"' + f + '" ';
			});

			return {
				command: toProcess
			};
		}
	} else {
		if (files.length > 50) {
			const include_filename_tmp = get_temp_filename();
			fs.writeFileSync(include_filename_tmp, files);
			// -ir@"files_to_include.txt"
			return {
				command: ` -ir\@\"${include_filename_tmp}\" `,
				filename: include_filename_tmp
			};
		} else {
			return {
				command: '"' + files + '"'
			};
		}
	}
}

function get_temp_filename(): string {
	const filename = path.join(os.tmpdir(), crypto.randomBytes(8).toString("hex"));
	return filename;
}
