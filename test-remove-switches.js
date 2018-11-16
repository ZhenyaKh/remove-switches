const fs = require("fs");
const execSync = require("child_process").execSync;

const toTest = require("./remove-switches");

const TEMPORARY_FILE_NAME = "temporary-test-remove-switches.js";
const SWITCH_KEYWORD = "switch";
const PIPE = "pipe";

function test(name, source, expected) {
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

        console.log(`${name}. Success: ${JSON.stringify(stdout)}`);

        fs.unlinkSync(TEMPORARY_FILE_NAME);
    }
    catch (error) {
        console.log(`${name}. ${error.toString()}`);
        process.exit();
    }
}

/*!
 * One empty switch
 */
test("Test   1",

`
switch(1) {
}
`,

"");

/*!
 * One switch with empty default
 */
test("Test   2",

`switch(1){default:}console.log("end");
`,

"end\n");


/*!
 * One switch with empty default with a break
 */
test("Test   3",

`
switch(1) {
    default:
        break;
}
`,

"");

/*!
 * One switch with non-empty default without a break
 */
test("Test   4",

`
switch(1) {
    default:
        console.log("default");
}
console.log("end");
`,

"default\nend\n");

/*!
 * One switch with non-empty default with a break
 */
test("Test   5",

`
switch(1) {
    default:
        console.log("default");
        break;
}
`,

"default\n");

/*!
 * One switch with one empty case without a break. The case is chosen.
 */
test("Test   6",

`
switch(1) {
    case 1:
}
`,

"");

/*!
 * One switch with one empty case with a break. The case is chosen.
 */
test("Test   7",

`
switch(1) {
    case 1:
        break;
}

console.log("end");

`,

"end\n");

/*!
 * One switch with one non-empty case without a break. The case is chosen.
 */
test("Test   8",

`
switch(1) {
    case 1:
        console.log("case 1");
}
`,

"case 1\n");

/*!
 * One switch with one non-empty case with a break. The case is chosen.
 */
test("Test   9",

`
console.log("start");switch(1) {
    case 1: console.log("case 1");
        break;
}console.log("end");
`,

"start\ncase 1\nend\n");

/*!
 * One switch with one empty case without a break. The case is not chosen.
 */
test("Test  10",

`
console.log("start");
switch(2) {
    case 1:
}
`,

"start\n");

/*!
 * One switch with one empty case with a break. The case is not chosen.
 */
test("Test  11",

`
switch(2) {case 1:break;}
`,

"");

/*!
 * One switch with one non-empty case without a break. The case is not chosen.
 */
test("Test  12",

`
switch(2) {
    case 1:
        console.log("case 1");
}console.log("end");
`,

"end\n");

/*!
 * One switch with one non-empty case with a break. The case is not chosen.
 */
test("Test  13",

`switch(2) {
    case 1:
        console.log("case 1");
        break;}`,

"");

/*!
 * One switch with one case (without a break) and then a default (without a break). The case is
 * called.
*/
test("Test  14",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

x = 1;

switch (x) {
    case case1():
		console.log("case1");
    default:
		console.log("default");
}

console.log("end");
`,

"function case1() called\ncase1\ndefault\nend\n");

/*!
 * One switch with one case (with a break) and then a default (without a break). The case is
 * called.
*/
test("Test  15",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

x = 1;

switch (x) {
    case case1():
		console.log("case1");break;
    default:
		console.log("default");
}

console.log("end");
`,

"function case1() called\ncase1\nend\n");

/*!
 * One switch with one case (without a break) and then a default (with a break). The case is
 * called.
*/
test("Test  16",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

x = 1;

switch (x) {
    case case1():
		console.log("case1");
    default:
		console.log("default");
		break;
}

console.log("end");
`,

"function case1() called\ncase1\ndefault\nend\n");

/*!
 * One switch with one case (with a break) and then a default (with a break). The case is
 * called.
*/
test("Test  17",

`function case1() {
    console.log("function case1() called");
    return 1;
}

x = 1;

switch (x) {
    case case1():
		console.log("case1");
		break;
    default:
		console.log("default");
		break;
}

console.log("end");`,

"function case1() called\ncase1\nend\n");

/*!
 * One switch with one case (without a break) and then a default (without a break). Default is
 * called.
*/
test("Test  18",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

x = 2;

switch (x) {
    case case1():
		console.log("case1");
    default:
		console.log("default");
}console.log("end");
`,

"function case1() called\ndefault\nend\n");

/*!
 * One switch with one case (with a break) and then a default (without a break). Default is called.
*/
test("Test  19",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

x = 2;

switch (x) {
    case case1(): console.log("case1"); break;

    default:
		console.log("default");
}
console.log("end");
`,

"function case1() called\ndefault\nend\n");

/*!
 * One switch with one case (without a break) and then a default (with a break). Default is called.
*/
test("Test  20",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

x = 2;

switch (x) {
    case case1(): console.log("case1");

    default: console.log("default"); break;
}
console.log("end");
`,

"function case1() called\ndefault\nend\n");

/*!
 * One switch with one case (with a break) and then a default (with a break). Default is called.
*/
test("Test  21",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

x = 2;

switch (x) {
    case case1(): console.log("case1"); break;

    default: console.log("default"); break;
}
console.log("end");
`,

"function case1() called\ndefault\nend\n");

/*!
 * One switch with a default (without a break) and then one case (without a break). The case is
 * called.
*/
test("Test  22",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

x = 1;

switch (x) {
    default:
		console.log("default");
    case case1():
		console.log("case1");
}

console.log("end");
`,

"function case1() called\ncase1\nend\n");

/*!
 * One switch with a default (without a break) and then one case (with a break). The case is called.
*/
test("Test  23",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

x = 1;

switch (x) {
    default:
		console.log("default");
    case case1():
		console.log("case1"); break;
}

console.log("end");
`,

"function case1() called\ncase1\nend\n");

/*!
 * One switch with a default (with a break) and then one case (without a break). The case is called.
*/
test("Test  24",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

x = 1;

switch (x) {
    default:
		console.log("default");
		break;
    case case1():
		console.log("case1");
}

console.log("end");
`,

"function case1() called\ncase1\nend\n");

/*!
 * One switch with a default (with a break) and then one case (with a break). The case is called.
*/
test("Test  25",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

switch (case1()) {
        default:
		console.log("default");
		break;
    case case1():
		console.log("case1");
		break;
}

console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\nend\n");

/*!
 * One switch with a default (without a break) and then one case (without a break). Default is
 * called.
*/
test("Test  26",

`function case1() {
    console.log("function case1() called");
    return 1;
}

x = 2;

switch (x) {
    default:
		console.log("default");
    case case1():
		console.log("case1");
}console.log("end");
`,

"function case1() called\ndefault\ncase1\nend\n");

/*!
 * One switch with a default (without a break) and then one case (with a break). Default is called.
*/
test("Test  27",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

x = 2;

switch (x) {
    default:
		console.log("default");
    case case1(): console.log("case1"); break;
}
console.log("end");`,

"function case1() called\ndefault\ncase1\nend\n");

/*!
 * One switch with a default (with a break) and then one case (without a break). Default is called.
*/
test("Test  28",

`function case1() {
    console.log("function case1() called");
    return 1;
}

x = 2;

switch (x) {
    default: console.log("default"); break;
    case case1(): console.log("case1");
}
console.log("end");`,

"function case1() called\ndefault\nend\n");

/*!
 * One switch with a default (with a break) and then one case (with a break). Default is called.
*/
test("Test  29",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

x = 2;

switch(x){default: console.log("default"); break; case case1(): console.log("case1"); break;}
console.log("end");
`,

"function case1() called\ndefault\nend\n");

/*!
 * One switch with two cases (both without breaks). The first case is called.
*/
test("Test  30",

`
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
    case case2():
		console.log("case2");
}

console.log("end");
`,

"function case1() called\ncase1\ncase2\nend\n");

/*!
 * One switch with two cases (the first one with a break and the second -- without). The first case
 * is called.
*/
test("Test  31",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

x = 1;

switch (case1()) {
    case case1():
		console.log("case1");
		break;
    case case2():
		console.log("case2");
}

console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\nend\n");

/*!
 * One switch with two cases (the first one without a break and the second -- with). The first case
 * is called.
*/
test("Test  32",

`
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
    case case2():
		console.log("case2"); break;
}

console.log("end");
`,

"function case1() called\ncase1\ncase2\nend\n");

/*!
 * One switch with two cases (both with breaks). The first case is called.
*/
test("Test  33",

`
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
		console.log("case1"); break;
    case case2():
		console.log("case2"); break;
}

console.log("end");
`,

"function case1() called\ncase1\nend\n");

/*!
 * One switch with two cases (both without breaks). The second case is called.
*/
test("Test  34",

`
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
    case case2():
		console.log("case2");
}

console.log("end");
`,

"function case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with two cases (the first one with a break and the second -- without). The second case
 * is called.
*/
test("Test  35",

`
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
    case case2():
		console.log("case2");
}

console.log("end");
`,

"function case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with two cases (the first one without a break and the second -- with). The second case
 * is called.
*/
test("Test  36",

`
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
    case case2():
		console.log("case2"); break;
}

console.log("end");
`,

"function case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with two cases (both with breaks). The second case is called.
*/
test("Test  37",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

x = 2;

switch (case2()) {
    case case1():
		console.log("case1"); break;
    case case2():
		console.log("case2"); break;console.log("case2");
}

console.log("end");
`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with two cases (both with breaks). No cases are called.
*/
test("Test  38",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (1 + case2()) {
    case case1():
		console.log("case1"); break;
    case case2():
		console.log("case2"); break;
}

console.log("end");
`,

"function case2() called\nfunction case1() called\nfunction case2() called\nend\n");

/*!
 * One switch with a default (without a break) and two cases (each without a break). The default is
 * called.
*/
test("Test  39",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    default:
		console.log("default");
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
}console.log("end");`,

"function case3() called\nfunction case1() called\nfunction case2() called\n" +
"default\ncase1\ncase2\nend\n");

/*!
 * One switch with a default (without a break) and two cases (each without a break). The first case
 * is called.
*/
test("Test  40",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    default:
		console.log("default");
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
}console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\ncase2\nend\n");

/*!
 * One switch with a default (without a break) and two cases (each without a break). The second case
 * is called.
*/
test("Test  41",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    default:
		console.log("default");
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
}console.log("end");
`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with a default (with a break) and two cases (each without a break). The default is
 * called.
*/
test("Test  42",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    default:
		console.log("default");
		break;
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
}console.log("end");`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\nend\n");

/*!
 * One switch with a default (with a break) and two cases (each without a break). The first case is
 * called.
*/
test("Test  43",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    default:
		console.log("default");break;
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
}console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\ncase2\nend\n");

/*!
 * One switch with a default (with a break) and two cases (each without a break). The second case
 * is called.
*/
test("Test  44",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    default:
		console.log("default"); break;
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
}console.log("end");`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with a default (without a break) and two cases (the first -- with a break and the
 * second -- without a break). The default is called.
*/
test("Test  45",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    default:
		console.log("default");
    case case1():
		console.log("case1"); break;
    case case2():
		console.log("case2");
}console.log("end");`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\ncase1\nend\n");

/*!
 * One switch with a default (without a break) and two cases (the first -- with a break and the
 * second -- without a break). The first case is called.
*/
test("Test  46",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    default:
		console.log("default");
    case case1():
		console.log("case1");
		break;
    case case2():
		console.log("case2");
}console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\nend\n");

/*!
 * One switch with a default (without a break) and two cases (the first -- with a break and the
 * second -- without a break). The second case is called.
*/
test("Test  47",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    default:
		console.log("default");
    case case1():
		console.log("case1");
break;
    case case2():
		console.log("case2");
}console.log("end");
`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with a default (with a break) and two cases (the first -- with a break and the
 * second -- without a break). The default is called.
*/
test("Test  48",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    default:
		console.log("default"); break;
    case case1():
		console.log("case1"); break;
    case case2():
		console.log("case2");
}console.log("end");`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\nend\n");

/*!
 * One switch with a default (with a break) and two cases (the first -- with a break and the
 * second -- without a break). The first case is called.
*/
test("Test  49",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    default:
		console.log("default");
		break;
    case case1():
		console.log("case1");
		break;
    case case2():
		console.log("case2");
}console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\nend\n");

/*!
 * One switch with a default (with a break) and two cases (the first -- with a break and the
 * second -- without a break). The second case is called.
*/
test("Test  50",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    default:
		console.log("default"); break;
    case case1():
		console.log("case1"); break;
    case case2():
		console.log("case2");
}console.log("end");
`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with a default (without a break) and two cases (the first -- without a break and the
 * second -- with a break). The default is called.
*/
test("Test  51",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    default:
		console.log("default");
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
		break;
}console.log("end");
`,

"function case3() called\nfunction case1() called\nfunction case2() called\n" +
"default\ncase1\ncase2\nend\n");

/*!
 * One switch with a default (without a break) and two cases (the first -- without a break and the
 * second -- with a break). The first case is called.
*/
test("Test  52",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    default:
		console.log("default");
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
		break;
}console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\ncase2\nend\n");

/*!
 * One switch with a default (without a break) and two cases (the first -- without a break and the
 * second -- with a break). The second case is called.
*/
test("Test  53",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    default:
		console.log("default");
    case case1():
		console.log("case1");
    case case2():
		console.log("case2"); break;
}console.log("end");
`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with a default (with a break) and two cases (the first -- without a break and the
 * second -- with a break). The default is called.
*/
test("Test  54",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    default:
		console.log("default");
	    break;
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
		break;
}console.log("end");
`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\nend\n");

/*!
 * One switch with a default (with a break) and two cases (the first -- without a break and the
 * second -- with a break). The first case is called.
*/
test("Test  55",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    default:
		console.log("default");
		break;
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
		break;
}console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\ncase2\nend\n");

/*!
 * One switch with a default (with a break) and two cases (the first -- without a break and the
 * second -- with a break). The second case is called.
*/
test("Test  56",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    default:
		console.log("default"); break;
    case case1():
		console.log("case1");
    case case2():
		console.log("case2"); break;
}console.log("end");`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with a default (without a break) and two cases (both with breaks). The default is
 * called.
*/
test("Test  57",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    default:
		console.log("default");
    case case1():
		console.log("case1");
		break;
    case case2():
		console.log("case2");
		break;
}console.log("end");
`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\ncase1\nend\n");

/*!
 * One switch with a default (without a break) and two cases (both with breaks). The first case is
 * called.
*/
test("Test  58",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    default:
		console.log("default");
    case case1():
		console.log("case1");
		break;
    case case2():
		console.log("case2");
		break;
}console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\nend\n");

/*!
 * One switch with a default (without a break) and two cases (both with breaks). The second case is
 * called.
*/
test("Test  59",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    default:
		console.log("default");
    case case1():
		console.log("case1"); break;
    case case2():
		console.log("case2"); break;
}console.log("end");`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with a default (with a break) and two cases (both with breaks). The default is called.
*/
test("Test  60",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    default:
		console.log("default");
		break;
    case case1():
		console.log("case1");
		break;
    case case2():
		console.log("case2");
		break;
}console.log("end");
`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\nend\n");

/*!
 * One switch with a default (with a break) and two cases (both with breaks). The first case is
 * called.
*/
test("Test  61",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    default:
		console.log("default");
		break;
    case case1():
		console.log("case1");
		break;
    case case2():
		console.log("case2");
		break;
}console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\nend\n");

/*!
 * One switch with a default (with a break) and two cases (both with breaks). The second case is
 * called.
*/
test("Test  62",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    default:
		console.log("default"); break;
    case case1():
		console.log("case1"); break;
    case case2():
		console.log("case2"); break;
}console.log("end");`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with a default (without a break) surrounded by two cases (each without a break).
 * The first case is called.
*/
test("Test  63",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1():
		console.log("case1");
    default:
		console.log("default");
    case case2():
		console.log("case2");
}console.log("end");`,

"function case1() called\nfunction case1() called\ncase1\ndefault\ncase2\nend\n");

/*!
 * One switch with a default (without a break) surrounded by two cases (each without a break).
 * Default is called.
*/
test("Test  64",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    case case1():
		console.log("case1");
    default:
		console.log("default");
    case case2():
		console.log("case2");
}console.log("end");
`,

"function case3() called\nfunction case1() called\nfunction case2() called\n" +
"default\ncase2\nend\n");

/*!
 * One switch with a default (without a break) surrounded by two cases (each without a break).
 * The second case is called.
*/
test("Test  65",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case1():
		console.log("case1");
    default:
		console.log("default");
    case case2():
		console.log("case2");
}console.log("end");
`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with a default (without a break) surrounded by two cases (the first case -- with a
 * break and the second case -- without a break). The default is called.
*/
test("Test  66",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    case case1():
		console.log("case1");
		break;
    default:
		console.log("default");
    case case2():
		console.log("case2");
}console.log("end");`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\ncase2\nend\n");

/*!
 * One switch with a default (without a break) surrounded by two cases (the first case -- with a
 * break and the second case -- without a break). The first case is called.
*/
test("Test  67",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1():
		console.log("case1");
		break;
    default:
		console.log("default");
    case case2():
		console.log("case2");
}console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\nend\n");

/*!
 * One switch with a default (without a break) surrounded by two cases (the first case -- with a
 * break and the second case -- without a break). The second case is called.
*/
test("Test  68",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case1():
		console.log("case1");
		break;
	default:
		console.log("default");
    case case2():
		console.log("case2");
}

console.log("end");
`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with a default (with a break) surrounded by two cases (both without breaks).
 * The default is called.
*/
test("Test  69",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    case case1():
		console.log("case1");
	default:
		console.log("default");
		break;
    case case2():
		console.log("case2");
}
console.log("end");`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\nend\n");

/*!
 * One switch with a default (with a break) surrounded by two cases (both without breaks).
 * The first case is called.
*/
test("Test  70",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1():
		console.log("case1");
    default:
		console.log("default");
		break;
    case case2():
		console.log("case2");
}
console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\ndefault\nend\n");

/*!
 * One switch with a default (with a break) surrounded by two cases (both without breaks).
 * The second case is called.
*/
test("Test  71",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case1():
		console.log("case1");
	default:
		console.log("default");
		break;
    case case2():
		console.log("case2");
}
console.log("end");
`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with a default (with a break) surrounded by two cases (the first -- with a break
 * and the second -- without a break). The default is called.
*/
test("Test  72",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    case case1():
		console.log("case1"); break;
	default:
		console.log("default"); break;
    case case2():
		console.log("case2");
}
console.log("end");`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\nend\n");

/*!
 * One switch with a default (with a break) surrounded by two cases (the first -- with a break
 * and the second -- without a break). The first case is called.
*/
test("Test  73",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1():
		console.log("case1");
		break;
	default:
		console.log("default");
		break;
    case case2():
		console.log("case2");
}console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\nend\n");

/*!
 * One switch with a default (with a break) surrounded by two cases (the first -- with a break
 * and the second -- without a break). The second case is called.
*/
test("Test  74",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case1():
		console.log("case1"); break;
	default:
		console.log("default"); break;
    case case2():
		console.log("case2");
}console.log("end");
`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with a default (without a break) surrounded by two cases (the first -- without a break
 * and the second -- with a break). The default is called.
*/
test("Test  75",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    case case1():
		console.log("case1");
	default:
		console.log("default");
    case case2():
		console.log("case2");
		break;
}
console.log("end");
`,

"function case3() called\nfunction case1() called\nfunction case2() called\n" +
"default\ncase2\nend\n");

/*!
 * One switch with a default (without a break) surrounded by two cases (the first -- without a break
 * and the second -- with a break). The first case is called.
*/
test("Test  76",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1():
		console.log("case1");
	default:
		console.log("default");
    case case2():
		console.log("case2");
		break;
}console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\ndefault\ncase2\nend\n");

/*!
 * One switch with a default (without a break) surrounded by two cases (the first -- without a break
 * and the second -- with a break). The second case is called.
*/
test("Test  77",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case1():
		console.log("case1");
	default:
		console.log("default");
    case case2():
		console.log("case2"); break;
}

console.log("end");
`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with a default (without a break) surrounded by two cases (both with breaks).
 * The default is called.
*/
test("Test  78",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    case case1():
		console.log("case1");
	    break;
	default:
		console.log("default");
    case case2():
		console.log("case2");
		break;
}
console.log("end");
`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\ncase2\nend\n");

/*!
 * One switch with a default (without a break) surrounded by two cases (both with breaks).
 * The first case is called.
*/
test("Test  79",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1():
		console.log("case1");
	    break;
	default:
		console.log("default");
    case case2():
		console.log("case2");
		break;
}
console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\nend\n");

/*!
 * One switch with a default (without a break) surrounded by two cases (both with breaks).
 * The second case is called.
*/
test("Test  80",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case1():
		console.log("case1");
	    break;
	default:
		console.log("default");
    case case2():
		console.log("case2");
		break;
}
console.log("end");
`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with a default (with a break) surrounded by two cases (the first one -- without a
 * break and the second one -- with a break). The default is called.
*/
test("Test  81",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    case case1():
		console.log("case1");
	default:
		console.log("default");
		break;
    case case2():
		console.log("case2");
		break;
}
console.log("end");
`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\nend\n");

/*!
 * One switch with a default (with a break) surrounded by two cases (the first one -- without a
 * break and the second one -- with a break). The first case is called.
*/
test("Test  82",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1():
		console.log("case1");
	default:
		console.log("default");
		break;
    case case2():
		console.log("case2");
		break;
}
console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\ndefault\nend\n");

/*!
 * One switch with a default (with a break) surrounded by two cases (the first one -- without a
 * break and the second one -- with a break). The second case is called.
*/
test("Test  83",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case1():
		console.log("case1");
	default:
		console.log("default");
		break;
    case case2():
		console.log("case2");
		break;
}console.log("end");`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with a default (with a break) surrounded by two cases (both with breaks).
 * The default is called.
*/
test("Test  84",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    case case1():
		console.log("case1");
		break;
    default:
		console.log("default");
		break;
    case case2():
		console.log("case2");
		break;
}
console.log("end");
`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\nend\n");


/*!
 * One switch with a default (with a break) surrounded by two cases (both with breaks).
 * The first case is called.
*/
test("Test  85",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1():
		console.log("case1");
		break;
    default:
		console.log("default");
		break;
    case case2():
		console.log("case2");
		break;
}
console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\nend\n");

/*!
 * One switch with a default (with a break) surrounded by two cases (both with breaks).
 * The second case is called.
*/
test("Test  86",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case1():
		console.log("case1"); break;
    default:
		console.log("default"); break;
    case case2():
		console.log("case2"); break;
}
console.log("end");`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with two cases (each without a break) and a default (without a break).
 * The default is called.
*/
test("Test  87",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
    default:
		console.log("default");
}

console.log("end");`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\nend\n");

/*!
 * One switch with two cases (each without a break) and a default (without a break).
 * The first case is called.
*/
test("Test  88",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
    default:
		console.log("default");
}
console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\ncase2\ndefault\nend\n");

/*!
 * One switch with two cases (each without a break) and a default (without a break).
 * The second case is called.
*/
test("Test  89",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
    default:
		console.log("default");
}
console.log("end");
`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\ndefault\nend\n");

/*!
 * One switch with two cases (the first one -- with a break and the second one -- without a break)
 * and a default (without a break). Default is called.
*/
test("Test  90",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    case case1():
		console.log("case1");
		break;
    case case2():
		console.log("case2");
    default:
		console.log("default");
}
console.log("end");`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\nend\n");

/*!
 * One switch with two cases (the first one -- with a break and the second one -- without a break)
 * and a default (without a break). The first case is called.
*/
test("Test  91",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1():
		console.log("case1"); break;
    case case2():
		console.log("case2");
    default:
		console.log("default");
}

console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\nend\n");

/*!
 * One switch with two cases (the first one -- with a break and the second one -- without a break)
 * and a default (without a break). The second case is called.
*/
test("Test  92",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case1():
		console.log("case1");
        break;
    case case2():
		console.log("case2");
    default:
		console.log("default");
}

console.log("end");`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\ndefault\nend\n");

/*!
 * One switch with two cases (the first one -- without a break and the second one -- with a break)
 * and a default (without a break). Default is called.
*/
test("Test  93",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
		break;
    default:
		console.log("default");
}

console.log("end");`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\nend\n");

/*!
 * One switch with two cases (the first one -- without a break and the second one -- with a break)
 * and a default (without a break). The first case is called.
*/
test("Test  94",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
		break;
    default:
		console.log("default");
}
console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\ncase2\nend\n");

/*!
 * One switch with two cases (the first one -- without a break and the second one -- with a break)
 * and a default (without a break). The second case is called.
*/
test("Test  95",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
		break;
    default:
		console.log("default");
}
console.log("end");
`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with two cases (both with breaks) and a default (without a break).
 * Default is called.
*/
test("Test  96",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    case case1():
		console.log("case1"); break;
    case case2():
		console.log("case2"); break;
    default:
		console.log("default");
}
console.log("end");`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\nend\n");

/*!
 * One switch with two cases (both with breaks) and a default (without a break).
 * The first case is called.
*/
test("Test  97",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1():
		console.log("case1");
		break;
    case case2():
		console.log("case2");
		break;
    default:
		console.log("default");
}

console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\nend\n");

/*!
 * One switch with two cases (both with breaks) and a default (without a break).
 * The second case is called.
*/
test("Test  98",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case1():
		console.log("case1");
		break;
    case case2():
		console.log("case2");
		break;
    default:
		console.log("default");
}

console.log("end");
`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with two cases (both without breaks) and a default (with a break).
 * Default is called.
*/
test("Test  99",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
    default:
		console.log("default");
		break;
}
console.log("end");
`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\nend\n");

/*!
 * One switch with two cases (both without breaks) and a default (with a break).
 * The first case is called.
*/
test("Test 100",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
    default:
		console.log("default");
		break;
}

console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\ncase2\ndefault\nend\n");

/*!
 * One switch with two cases (both without breaks) and a default (with a break).
 * The second case is called.
*/
test("Test 101",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
    default:
		console.log("default");
		break;
}

console.log("end");
`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\ndefault\nend\n");

/*!
 * One switch with two cases (the first one -- with a break and the second one -- without a break)
 * and a default (with a break). Default is called.
*/
test("Test 102",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    case case1():
		console.log("case1");
		break;
    case case2():
		console.log("case2");
    default:
		console.log("default");
	    break;
}

console.log("end");
`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\nend\n");

/*!
 * One switch with two cases (the first one -- with a break and the second one -- without a break)
 * and a default (with a break). The first case is called.
*/
test("Test 103",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1():
		console.log("case1");
		break;
    case case2():
		console.log("case2");
    default:
		console.log("default");
	    break;
}

console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\nend\n");

/*!
 * One switch with two cases (the first one -- with a break and the second one -- without a break)
 * and a default (with a break). The second case is called.
*/
test("Test 104",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case1():
		console.log("case1");
		break;
    case case2():
		console.log("case2");
    default:
		console.log("default");
	    break;
}
console.log("end");`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\ndefault\nend\n");

/*!
 * One switch with two cases (the first one -- without a break and the second one -- with a break)
 * and a default (with a break). Default is called.
*/
test("Test 105",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
		break;
    default:
		console.log("default");
		break;
}console.log("end");
`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\nend\n");

/*!
 * One switch with two cases (the first one -- without a break and the second one -- with a break)
 * and a default (with a break). The first case is called.
*/
test("Test 106",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1():
		console.log("case1");
    case case2():
		console.log("case2"); break;
    default:
		console.log("default"); break;
}console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\ncase2\nend\n");

/*!
 * One switch with two cases (the first one -- without a break and the second one -- with a break)
 * and a default (with a break). The second case is called.
*/
test("Test 107",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case1():
		console.log("case1");
    case case2():
		console.log("case2");
		break;
    default:
		console.log("default");
		break;
}

console.log("end");`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with two cases (both with breaks) and a default (with a break). Default is called.
*/
test("Test 108",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch (case3()) {
    case case1():
		console.log("case1");
		break;
    case case2():
		console.log("case2");
		break;
    default:
		console.log("default");
		break;
}console.log("end");
`,

"function case3() called\nfunction case1() called\nfunction case2() called\ndefault\nend\n");

/*!
 * One switch with two cases (both with breaks) and a default (with a break).
 * The first case is called.
*/
test("Test 109",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1():
		console.log("case1");
		break;
    case case2():
		console.log("case2");
		break;
    default:
		console.log("default");
		break;
}

console.log("end");
`,

"function case1() called\nfunction case1() called\ncase1\nend\n");

/*!
 * One switch with two cases (both with breaks) and a default (with a break).
 * The second case is called.
*/
test("Test 110",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case1():
		console.log("case1");
		break;
    case case2():
		console.log("case2");
		break;
    default:
		console.log("default");
		break;
}

console.log("end");`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * One switch with two cases (both with breaks) and a default (with a break).
 * The second case is called.
*/
test("Test 110",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case1():
		console.log("case1");
		break;
    case case2():
		console.log("case2");
		break;
    default:
		console.log("default");
		break;
}

console.log("end");`,

"function case2() called\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * Two switches
*/
test("Test 111",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case2():
		console.log("case2");
    default:
		console.log("default");
}

console.log("next");

switch (case2()) {
    default:
		console.log("default");
    case case1():
		console.log("case1");
}

console.log("end");
`,

"function case1() called\nfunction case2() called\ndefault\nnext\n" +
"function case2() called\nfunction case1() called\ndefault\ncase1\nend\n");

/*!
 * A nested switch. The nesting switch had a case and default. Default is chosen.
*/
test("Test 112",

`
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
    case case2():
		console.log("case2");
    default:
		console.log("default");
		x++;
		switch (x) {
            case case1():
                console.log("case1");
            case case2():
                console.log("case2");
        }
}

console.log("end");
`,

"function case2() called\ndefault\nfunction case1() called\nfunction case2() called\ncase2\nend\n");

/*!
 * A nested switch. The nesting switch had a case and default. The case is chosen.
*/
test("Test 113",

`
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
    case case2():
		console.log("case2");
    default:
		console.log("default");
		x--;
		switch (x) {
		    case case2():
                console.log("case2");
            case case1():
                console.log("case1");
        }
}

console.log("end");
`,

"function case2() called\ncase2\ndefault\n" +
"function case2() called\nfunction case1() called\ncase1\nend\n");

/*!
 * A switch and a couple of switches nested one into each other.
*/
test("Test 114",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1() : console.log("Switch 1 case 1");
}

switch (case2()) {
    case case2():
		console.log("Switch 2 case 2");
		switch (case1()) {
		    case case1():
                console.log("nested Switch case 1");
        }
}

console.log("end");
`,

"function case1() called\nfunction case1() called\nSwitch 1 case 1\n" +
"function case2() called\nfunction case2() called\nSwitch 2 case 2\n" +
"function case1() called\nfunction case1() called\nnested Switch case 1\nend\n");

/*!
 * A couple of switches nested one into each other and a switch.
*/
test("Test 115",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case2():
		console.log("Switch 1 case 2");
		switch (case1()) {
		    case case1():
                console.log("nested Switch case 1");
        }
}

switch (case1()) {
    default : console.log("Switch 2 default");
}

console.log("end");
`,

"function case2() called\nfunction case2() called\nSwitch 1 case 2\n" +
"function case1() called\nfunction case1() called\nnested Switch case 1\n" +
"function case1() called\nSwitch 2 default\nend\n");

/*!
 * A nested switch surrounded by switches.
*/
test("Test 116",

`
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case1()) {
    case case1() : console.log("Switch 1 case 1");
}

switch (case2()) {
    case case2():
		console.log("Switch 2 case 2");
		switch (case1()) {
		    case case1():
                console.log("nested Switch case 1");
        }
}

switch (case1()) {
    default : console.log("Switch 3 default");
}

console.log("end");
`,

"function case1() called\nfunction case1() called\nSwitch 1 case 1\n" +
"function case2() called\nfunction case2() called\nSwitch 2 case 2\n" +
"function case1() called\nfunction case1() called\nnested Switch case 1\n" +
"function case1() called\nSwitch 3 default\nend\n");

/*!
 * Three switches;
*/
test("Test 117",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

function case3() {
    console.log("function case3() called");
    return 3;
}

switch(case1()) {
    case 1: console.log("case 1");
    break;
}

switch(case2()) {
    case 2: console.log("case 2");
    break;
}

switch(case3()) {
    case 3: console.log("case 3");
    break;
};`,

"function case1() called\ncase 1\nfunction case2() called\ncase 2\n" +
"function case3() called\ncase 3\n");

/*!
 * Two nested switches
*/
test("Test 118",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

x = 2;

switch (x) {
    case case2():
		console.log("case2");
    default:
		console.log("default");
		x--;
		switch (x) {
		    case case2():
                console.log("case2");
            case case1():
                console.log("case1");
        }
}

x++;

switch (x) {
    case case2():
		console.log("case2");
    default:
		console.log("default");
		x--;
		switch (x) {
		    case case2():
                console.log("case2");
            case case1():
                console.log("case1");
        }
}

console.log("end");
`,

"function case2() called\ncase2\ndefault\nfunction case2() called\nfunction case1() called\ncase1" +
"\nfunction case2() called\ncase2\ndefault\nfunction case2() called\nfunction case1() called" +
"\ncase1\nend\n");

/*!
 * Two switches nested in different cases of a nesting switch
*/
test("Test 119",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

switch (case2()) {
    case case2():
		console.log("case2");
		switch (case1()) {
		    case case2():
                console.log("nested1 case2");
            case case1():
                console.log("nested1 case1");
        }
    default:
		console.log("default");
		switch (3) {
            default:
                console.log("nested2 default");
                break;
            case case1():
                console.log("nested2 case1");
        }
}

console.log("end");
`,

"function case2() called\nfunction case2() called\ncase2\nfunction case1() called\n" +
"function case2() called\nfunction case1() called\nnested1 case1\ndefault\n" +
"function case1() called\nnested2 default\nend\n");

/*!
 * Two switches nested in one case of a nesting switch
*/
test("Test 120",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

x = 2;

switch (x) {
    case case2():
		console.log("case2");
		x--;
		switch (x) {
		    case case2():
                console.log("nested1 case2");
            case case1():
                console.log("nested1 case1");
        }switch (x) {
            default:
                console.log("nested2 default");
                break;
            case case2():
                console.log("nested2 case2");
        }
    default:
        console.log("default");
        break;
    case case1():
		console.log("case1");
}

console.log("end");
`,

"function case2() called\ncase2\nfunction case2() called\nfunction case1() called\n" +
"nested1 case1\nfunction case2() called\nnested2 default\ndefault\nend\n");

/*!
 * A doubly nested switch. The topmost switch has default and a case. Default is called.
*/
test("Test 121",

`function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

x = 2;

switch (x) {
    default:
        console.log("default");
    case case1():
		x--;
		switch (x) {
		    case 2:
                console.log("nested1 case2");
            case 1:
                console.log("nested1 case1");
                switch (x) {
                    default:
                        console.log("nested2 default");
                        break;
                    case case2():
                        console.log("nested2 case2");
                }
        }
}

console.log("end");
`,

"function case1() called\ndefault\nnested1 case1\nfunction case2() called\nnested2 default\nend\n");

/*!
 * A doubly nested switch. The topmost switch has default and a case. The case is called.
*/
test("Test 122",

`
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
    default:
        console.log("default");
    case case1():
		x = x;
		switch (x) {
		    case 2:
                console.log("nested1 case2");
            case 1:
                console.log("nested1 case1");
                switch (x) {
                    default:
                        console.log("nested2 default");
                        break;
                    case case2():
                        console.log("nested2 case2");
                }
        }
}

console.log("end");
`,

"function case1() called\nnested1 case1\nfunction case2() called\nnested2 default\nend\n");

/*!
 * Two doubly nested switches.
*/
test("Test 123",

`
console.log("start");

x = 1;
switch (x) {
    case 1:
        console.log("Switch 1");
        switch(--x) {
            case 0:
                console.log("nested Switch 1");
            case 4:
                switch(x) {
                    default:
                        console.log("doubly nested Switch 1");
                }
        }
    case 2:
}

switch (++x) {
    case 2:
    case 1:
    console.log("Switch 2");
    switch(x * 3) {
        case 3:
            console.log("nested Switch 2");
        case 4:
            switch(x) {
                default:
                    console.log("doubly nested Switch 2");
            }
    }
}

console.log("end");
`,

"start\nSwitch 1\nnested Switch 1\ndoubly nested Switch 1\n" +
"Switch 2\nnested Switch 2\ndoubly nested Switch 2\nend\n");

/*!
 * Switch not inside a block statement
*/
test("Test 124",

`
console.log("start");

for (i = 1; i <= 2; i++)
    switch (i) {
        case 1:
            console.log("case " + i);
            break;
        case 2:
            console.log("case " + i);
            break;
    }

console.log("end");
`,

"start\ncase 1\ncase 2\nend\n");

/*!
 * Switch inside a labeled statement using a labeled break
*/
test("Test 125",

`
console.log("start");

mylabel:
for (i = 1; i <= 2; i++) {
    console.log("cycle");
    switch (i) {
        case 1:
            console.log("case 1");
            break mylabel;
        case 2:
            console.log("case 2");
    }
}

console.log("end");
`,

"start\ncycle\ncase 1\nend\n");

/*!
 * Switch inside a labeled statement not using a labeled break
*/
test("Test 126",

`
console.log("start");

mylabel:
for (i = 1; i <= 2; i++) {
    console.log("cycle");
    switch (i) {
        case 1:
            console.log("case 1");
            break;
        case 2:
            console.log("case 2");
    }
}

console.log("end");
`,

"start\ncycle\ncase 1\ncycle\ncase 2\nend\n");

/*!
 * Switch inside a discriminant of a switch
*/
test("Test 127",

`
switch(function f () 
       {
           switch(1) {
               case 1:
                   console.log("case 1");
                   return 2;
           }
       }()) 
{                    
    case 2:
        console.log("case 2");
}                
`,

"case 1\ncase 2\n");

/*!
 * Sequence expression (function f() {...}(), 2) as a switch discriminant
*/
test("Test 128",

`
function foo () {
    console.log("foo");
    return 1;
}

switch(function f () 
       {
           switch(foo()) {                             
               case 2:    
               case 1:
                   console.log("case 1");
                   return 1;                             
           }
       }(), 2) 
{                    
    case 2:
        console.log("case 2");
}                
`,

"foo\ncase 1\ncase 2\n");
