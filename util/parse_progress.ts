import path = require("path");
import { IVersionInfo, z7_version } from "../src/detect";

const progress_7z_17 = ["+", "U", "A", "=", "R", ".", "D", "T", "-"];
const progress_7z_16 = ["Compressing  ", "Extracting  ", "Testing     "];

export function parse_progress(progress_data: string): string[] {
	const entries: string[] = [];
	progress_data.split("\n").forEach((line: string) => {
		if (z7_version.major >= 17) {
			for (const update_op of progress_7z_17) {
				if (line.startsWith(update_op + " ")) {
					entries.push(line.substr((update_op + " ").length).replace(path.sep, "/"));
				}
			}
		} else {
			for (const update_op of progress_7z_16) {
				if (line.startsWith(update_op)) {
					entries.push(line.substr((update_op).length).replace(path.sep, "/"));
				}
			}
		}
	});
	return entries;
}
