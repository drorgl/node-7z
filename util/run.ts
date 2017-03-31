import os = require("os");
import child_process = require("child_process");
const spawn = child_process.spawn;
import when = require("when");
import path = require("path");
import { Node7zError } from "./node7z_error";
import { ISwitches, options_object_to_array } from "./switches";

/**
 * @promise Run
 * @param {string} command The command to run.
 * @param {Array} switches Options for 7-Zip as an array.
 * @progress {string} stdout message.
 * @reject {Error} The error issued by 7-Zip.
 * @reject {number} Exit code issued by 7-Zip.
 */
export default function run(command: string, switches?: ISwitches): when.Deferred<string[]> {
	const defer = when.defer<string[]>();
	// return when.promise<string[]>((fulfill , reject ) =>{

	// Parse the command variable. If the command is not a string reject the
	// Promise. Otherwise transform the command into two variables: the command
	// name and the arguments.
	if (typeof command !== "string") {
		defer.reject(new Error("Command must be a string"));
		return defer;
	}
	const cmd = command.split(" ")[0];
	const args = [command.split(" ")[1]];

	// Parse and add command (non-switches parameters) to `args`.
	const regexpCommands = /"((?:\\.|[^"\\])*)"/g;
	const commands = command.match(regexpCommands);
	if (commands) {
		commands.forEach((c) => {
			c = c.replace(/\//, path.sep);
			c = c.replace(/\\/, path.sep);
			c = path.normalize(c);
			args.push(c);
		});
	}

	// Special treatment for the output switch because it is exposed as a
	// parameter in the API and not as a option. Plus wilcards can be passed.
	const regexpOutput = /-o"((?:\\.|[^"\\])*)"/g;
	const output = command.match(regexpOutput);
	if (output) {
		args.pop();
		let o = output[0];
		o = o.replace(/\//, path.sep);
		o = o.replace(/\\/, path.sep);
		o = o.replace(/"/g, "");
		o = path.normalize(o);
		args.push(o);
	}

	// Add switches to the `args` array.
	const switchesArray = options_object_to_array(switches);
	switchesArray.forEach((s) => { args.push(s); });

	// Remove now double quotes. If present in the spawned process 7-Zip will
	// read them as part of the paths (e.g.: create a `"archive.7z"` with
	// quotes in the file-name);
	args.forEach((e, i) => {
		if (typeof e !== "string") {
			return;
		}
		if (e.substr(0, 1) !== "-") {
			e = e.replace(/^"/, "");
			e = e.replace(/"$/, "");
			args[i] = e;
		}
	});

	// When an stdout is emitted, parse it. If an error is detected in the body
	// of the stdout create an new error with the 7-Zip error message as the
	// error's message. Otherwise progress with stdout message.
	let err: Error;
	const reg = new RegExp("Error:" + os.EOL + "?(.*)", "g");
	const res = {
		cmd,
		args,
		options: { stdio: "pipe" }
	};

	const run = spawn(res.cmd, res.args, res.options);
	run.stdout.on("data", (data) => {
		const errres = reg.exec(data.toString());
		if (errres) {
			err = new Error(errres[1]);
		}
		defer.notify(data.toString());
		// return progress(data.toString());
	});
	run.stderr.on("data", (data) => {
		// throw errors
		err = new Error(data.toString());
	});
	run.on("error", (errrej) => {
		defer.reject(errrej);
	});
	run.on("close", (code) => {
		if (code === 0) {
			return defer.resolve(args);
		}
		defer.reject(new Node7zError(err, code));
		// return reject(new Node7zError(err, code));
	});

	// });
	return defer;
}
