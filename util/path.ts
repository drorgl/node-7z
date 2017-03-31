"use strict";

export interface IOptions {
	path: string;
}

export default function node7z_path(options: IOptions) {

	// Create a string that can be parsed by `run`.
	try {

		if (options.path) {
			return options.path;
		} else {
			return "7z";
		}

	} catch (e) {
		throw new Error("Path to the 7-Zip bin not found");
	}

}
