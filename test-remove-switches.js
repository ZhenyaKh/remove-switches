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

        //fs.unlinkSync(TEMPORARY_FILE_NAME);
    }
    catch (error) {
        console.log(`${name}. ${error.toString()}`);
        process.exit();
    }
}

/*!
 * One empty switch
 */
test("Test  1",

`
switch(1) {
}
`,

"");

/*!
 * One switch with empty default
 */
test("Test  2",

`switch(1){default:}console.log("end");
`,

"end\n");


/*!
 * One switch with empty default with a break
 */
test("Test  3",

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
test("Test  4",

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
test("Test  5",

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
test("Test  6",

`
switch(1) {
    case 1:        
}
`,

"");

/*!
 * One switch with one empty case with a break. The case is chosen.
 */
test("Test  7",

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
test("Test  8",

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
test("Test  9",

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
test("Test 10",

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
test("Test 11",

`
switch(2) {case 1:break;}
`,

"");

/*!
 * One switch with one non-empty case without a break. The case is not chosen.
 */
test("Test 12",

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
test("Test 13",

`switch(2) {
    case 1:
        console.log("case 1");
        break;}`,

"");

/*!
 * One switch with one case (without a break) and then a default (without a break). The case is
 * called.
*/
test("Test 14",

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
test("Test 15",

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
test("Test 16",

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
test("Test 17",

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
test("Test 18",

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
test("Test 19",

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
test("Test 20",

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
test("Test 21",

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
test("Test 22",

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
test("Test 23",

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
test("Test 24",

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
test("Test 25",

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
test("Test 26",

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
test("Test 27",

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
test("Test 28",

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
test("Test 29",

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
test("Test 30",

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
test("Test 31",

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
test("Test 32",

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
test("Test 33",

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
test("Test 34",

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
test("Test 35",

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
test("Test 36",

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
test("Test 37",

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
test("Test 38",

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
test("Test 39",

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
test("Test 40",

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
test("Test 41",

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
test("Test 42",

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
test("Test 43",

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
test("Test 44",

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
test("Test 45",

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
test("Test 46",

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
test("Test 47",

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
test("Test 48",

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
test("Test 49",

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
test("Test 50",

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
test("Test 51",

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
test("Test 52",

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
test("Test 53",

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


//
// /*!
//  * One switch with two cases (each with a break) and a default (without a break). The first case
//  * is called.
// */
// test(`
// function case1() {
//     console.log("function case1() called");
//     return 1;
// }
//
// function case2() {
//     console.log("function case2() called");
//     return 2;
// }
//
// x = 1;
//
// switch (x) {
//     case case1():
// 		console.log("case1");
// 		break;
//     default:
// 		console.log("default");
//     case case2():
// 		console.log("case2");
// 		break;
// }
// `, "function case1() called\ncase1\n");
//
// /*!
//  * One switch with two cases (each with a break) and a default (without a break). Default is called.
//  */
// test(`
// function case1() {
//     console.log("function case1() called");
//     return 1;
// }
//
// function case2() {
//     console.log("function case2() called");
//     return 2;
// }
//
// x = 3;
//
// switch (x) {
//     case case1():
// 		console.log("case1");
// 		break;
//     default:
// 		console.log("default");
//     case case2():
// 		console.log("case2");
// 		break;
// }
// `, "function case1() called\nfunction case2() called\ndefault\ncase2\n");
//
// /*!
//  * One switch with two cases (each with a break) and a default (without a break). The second case
//  * is called.
//  */
// test(`
// function case1() {
//     console.log("function case1() called");
//     return 1;
// }
//
// function case2() {
//     console.log("function case2() called");
//     return 2;
// }
//
// x = 2;
//
// switch (x) {
//     case case1():
// 		console.log("case1");
// 		break;
//     default:
// 		console.log("default");
//     case case2():
// 		console.log("case2");
// 		break;
// }
// `, "function case1() called\nfunction case2() called\ncase2\n");
//


