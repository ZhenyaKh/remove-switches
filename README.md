# remove-switches

This JavaScript library makes translation of valid JavaScript code given as input in the following way: the library converts all switch statements present in the piece of code to loop and if statements. So, put simply, this library allows one to remove all switches from a JavaScript piece of code, while keeping the semantics of the code.

At the first glance, one can think that the solution should be easy like e.g. turning a switch statement into a simple if-elif-else statement. But this is not true if we remember the following:

- There can be no break statement in a case branch, so after execution of the case branch we can fall through to the next case branch

  `switch(1) { case 1: // execute this; case 2: // and this; default: // and this }`

- The number of times of evaluation of a discriminant of a switch and of test expressions of case branches of a switch should be preserved. This is because the discriminant and the test expressions can be function calls with side effects:

  `switch(function_with_side_effects1()) { case function_with_side_effects2(): // do stuff }`

- The default case is not necessarily the last case of a switch and also may have no break statement:

  ```
  function f() { console.log("function f."); return 1; }
  function g() { console.log("function g."); return 2; }
  function h() { console.log("function h."); return 3; }

  switch(h()){ case f(): console.log("case 1."); 
               default:  console.log("default."); 
               case g(): console.log("case 2."); }

  // Output: function h. function f. function g. default. case 2.
  ```

- There can be nested switch statements inside a case branch of a switch statement

- There can be nested switch statements in a function definition present in a switch's discriminant:

  `switch(f(){switch(...){...}}) {...}`
  
- There can be labeled break statements in a case branch of a switch statement

- A break statement present in a case branch of a switch should not be necessarily the break statement associated with the case branch:

  `switch(...) { case 1: for(;;){break} }`
  
- A break statement of a case branch can be inside a block statement or several block statements:
 
  `switch(...) { case 1: {{break}} }`
 
- Many other problems which I forgot to mention. The difficulty of the research problem is also partly explained in the documentation file present in the repository.

The **thorough suite of unit-tests** is also present in the repository and checks a really vast number of testing cases. All the problems listed above have corresponding tests in the suite.

## Dependencies

JavaScript libraries esprima and escodegen are already present in the repository.

## Usage

Usage of the library is extremely simple and can be seen in the file with the unit-tests. But the idea is present below.

```js
const switchRemoval = require("./remove-switches");
var newSourceString = switchRemoval.removeSwitches(oldSourceString);
```
