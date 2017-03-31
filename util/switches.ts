export interface ISwitches {
	so?: boolean;
	spl?: boolean;
	ssc?: boolean;
	ssw?: boolean;
	y?: boolean;

	wildcards?: string[];

	raw?: string[];

	[key: string]: any;
}

/**
 * Transform an object of options into an array that can be passed to the
 * spawned child process.
 * @param  {Object} switches An object of options
 * @return {array} Array to pass to the `run` function.
 */
export function options_object_to_array(switches: ISwitches) {

	// Default value for switches
	switches = switches || {};

	const a: string[] = [];
	// Set default values of boolean switches
	switches.so = (switches.so === true) ? true : false;
	switches.spl = (switches.spl === true) ? true : false;
	switches.ssc = (switches.ssc === false) ? false : true;
	switches.ssw = (switches.ssw === true) ? true : false;
	switches.y = (switches.y === false) ? false : true;

	/*jshint forin:false*/
	for (const s in switches) {
		if (!switches.hasOwnProperty(s)) {
			continue;
		}

		// Switches that are set or not. Just add them to the array if they are
		// present. Differ the `ssc` switch treatment to later in the function.
		if (switches[s] === true && s !== "ssc") {
			a.push("-" + s);
		}

		// Switches with a value. Detect if the value contains a space. If it does
		// wrap the value with double quotes. Else just add the switch and its value
		// to the string. Doubles quotes are used for parsing with a RegExp later.
		if (typeof switches[s] !== "boolean") {

			// Special treatment for wilcards
			if (s === "wildcards") {
				switches.wildcards.forEach((wildvalue, index) => {
					a.unshift(wildvalue);
				});
			} else if (s === "raw") {
				// Allow raw switches to be added to the command, repeating switches like
				// -i is not possible otherwise.
				switches.raw.forEach((rawValue) => {
					a.push(rawValue);
				});
			} else if (switches[s].indexOf(" ") === -1) {
				a.push("-" + s + switches[s]);
			} else {
				a.push("-" + s + '"' + switches[s] + '"');
			}
		}

		// Special treatment for `-ssc`
		if (s === "ssc") {
			a.push((switches.ssc === true) ? "-ssc" : "-ssc-");
		}

	}

	return a;

}
