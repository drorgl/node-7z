import child_process = require("child_process");

/*
Test Data:
7-Zip [64] 9.20  Copyright (c) 1999-2010 Igor Pavlov  2010-11-18
7-Zip 9.20  Copyright (c) 1999-2010 Igor Pavlov  2010-11-18
7-Zip 17.00 beta (x64) : Copyright (c) 1999-2017 Igor Pavlov : 2017-04-29
 */
const zip7_version_regex = /7-Zip\s*(?:\[\d*\]\s)?(\d*.\d*)\s*(?:beta\s)?(?:\(\S*\)\s*)?(?:\:\s)?Copyright/gm;

export interface IVersionInfo {
	version: string;
	major: number;
	minor: number;
	patch: number;
}

export let z7_version: IVersionInfo = null;

const z7_status = child_process.spawnSync("7z", [], { shell: true });
if (z7_status.status === 0) {
	const parsed_version = zip7_version_regex.exec(z7_status.output.join("").toString()).slice(1);
	z7_version = {
		version: parsed_version.join("."),
		major: parseInt(parsed_version[0]),
		minor: parseInt(parsed_version[1]),
		patch: parseInt(parsed_version[2])
	};
}else{
	throw new Error("7z was not found");
}
