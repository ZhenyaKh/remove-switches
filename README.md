# Replace-Switches JavaScript Library

This JS library makes translation of valid JavaScript code given as input in the following way: the library converts all switch statements present in the piece of code to loop and if statements. So, put simply, this library allows one to remove all switches from a JavaScript piece of code, while keeping the semantics of the code.

At the first glance, one can think that the solution should be easy like e.g. turning a switch statement into a simple if-elif-else statement. But this is not true if we remember the problems listed below. The **thorough suite of unit-tests** is present in the repository and checks a really vast number of testing cases. All the problems listed below have corresponding unit-tests in the suite:

- There can be no break statement in a case branch, so after execution of the case branch we can fall through to the next case branch:

  `switch(1) { case 1: // execute this; case 2: // and this; default: // and this }`

- The number of times of evaluation of a discriminant of a switch and of test expressions of case branches of a switch should be preserved. This is because the discriminant and the test expressions can be function calls with side effects:

  `switch(function_with_side_effects1()) { case function_with_side_effects2(): // do stuff }`

- The default case is not necessarily the last case of a switch and also may have no break statement:

  ```js
  function f() { console.log("function f."); return 1; }
  function g() { console.log("function g."); return 2; }
  function h() { console.log("function h."); return 3; }

  switch(h()){ case f(): console.log("case 1."); 
               default:  console.log("default."); 
               case g(): console.log("case 2."); }

  // Output: function h. function f. function g. default. case 2.
  ```

- There can be nested switch statements inside a case branch of a switch statement:

  `switch(...) { case 1: switch (...) { ... } }`

- There can be nested switch statements in a function definition present in a switch's discriminant:

  `switch(f(){switch(...){...}}) {...}`
  
- There can be labeled break statements in a case branch of a switch statement.

- A break statement present in a case branch of a switch should not be necessarily the break statement associated with the case branch:

  `switch(...) { case 1: for(;;){break} }`
  
- A break statement of a case branch can be inside a block statement or several block statements:
 
  `switch(...) { case 1: {{break}} }`
 
- Many other problems which I forgot to mention. The difficulty of the research problem is also partly explained in the documentation file `docs/switch_problem.pdf` present in the repository.

## Dependencies

JavaScript libraries esprima and escodegen are already present in the repository.

## Usage

Usage of the library is extremely simple and can be seen in the file with the unit-tests. But the idea is present below:

```js
const switchRemoval = require("./remove-switches");
var newSourceString = switchRemoval.removeSwitches(oldSourceString);
```
## Example

The input of the unit-test #76 is the following:

```js
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
```

The resulting piece of code is the following:

```js
function case1() {
    console.log('function case1() called');
    return 1;
}
function case2() {
    console.log('function case2() called');
    return 2;
}
do {
    const _uhbhl9pob = case1();
    if (_uhbhl9pob === case1()) {
        console.log('case1');
        console.log('default');
        console.log('case2');
        break;
        break;
    }
    if (_uhbhl9pob === case2()) {
        console.log('case2');
        break;
        break;
    }
    console.log('default');
    console.log('case2');
    break;
    break;
} while (false);
console.log('end');
```

The output of both the pieces of code is:

```
case1
default
case2
end
```
