export class Node7zError extends Error {
	constructor(err: Error, public code?: number, public command?: any) {
		super(((err) ? err.message : "error code " + code) + JSON.stringify(command));
		if (err) {
			this.name = err.name;
			this.stack = err.stack;
		}
	}
}
