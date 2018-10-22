const fs = require("fs");
const execSync = require("child_process").execSync;
const child_process = require("child_process");

const toTest = require("./remove-switches");

const TEMPORARY_FILE_NAME = "temporary-test-remove-switches.js";
const SWITCH_KEYWORD = "switch";
const PIPE = "pipe";

function test(source, expected) {
    try {
        var newSource = toTest.removeSwitches(source);

        if (newSource.includes(SWITCH_KEYWORD)) {
            throw "Switch keyword found";
        }

        fs.writeFileSync(TEMPORARY_FILE_NAME, newSource);

        var cmd = `node ${TEMPORARY_FILE_NAME}`;
        var stdout = execSync(cmd, { stdio : PIPE }).toString();

        if (expected !== stdout) {
            console.log("Expected: " + JSON.stringify(expected));
            console.log("Real    : " + JSON.stringify(stdout));
            throw "Expected value is not equal to the real one";
        }

        console.log("Success: " + JSON.stringify(stdout));

        //fs.unlinkSync(TEMPORARY_FILE_NAME);
    }
    catch (error) {
        console.log(error.toString());
        process.exit();
    }
}

/*!
 * One empty switch
 */
test(`
switch(1) {
}
`, "");

/*!
 * One switch with non-empty default without a break
 */
test(`
switch(1) {
    default:
        console.log("default");
}
`, "default\n");

/*!
 * One switch with non-empty default with a break
 */
test(`
switch(1) {
    default:
        console.log("default");
        break;
}
`, "default\n");

/*!
 * One switch with two cases (each with a break) and a default (without a break). The first case
 * is called.
*/
test(`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

x = 1;

switch (x) {
    case case1():
		console.log("case1");
		break;
    default:
		console.log("default");
    case case2():
		console.log("case2");
		break;
}
`, "function case1() called\ncase1\n");

/*!
 * One switch with two cases (each with a break) and a default (without a break). Default is called.
 */
test(`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

x = 3;

switch (x) {
    case case1():
		console.log("case1");
		break;
    default:
		console.log("default");
    case case2():
		console.log("case2");
		break;
}
`, "function case1() called\nfunction case2() called\ndefault\ncase2\n");

/*!
 * One switch with two cases (each with a break) and a default (without a break). The second case
 * is called.
 */
/*test(`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

x = 2;

switch (x) {
    case case1():
		console.log("case1");
		break;
    default:
		console.log("default");
    case case2():
		console.log("case2");
		break;
}
`, "function case1() called\nfunction case2() called\ncase2\n");*/



