/*global afterEach */
import fs = require("fs-extra");

// Remove the `.tmp/` directory after each test.
afterEach(() => {
	fs.removeSync(".tmp/");
});
