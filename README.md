# remove-switches

This JavaScript library makes translation of valid JavaScript code given as input in the following way: the library converts all switch statements present in the piece of code to loop and if statements. So, put simply, this library allows one to remove all switches from a JavaScript piece of code, while keeping the semantics of the code.

At the first glance, one can think that the solution should be easy like e.g. turning a switch statement into a simple if-elif-else statement. But this is not true if we remember the following:

- There can be no break statement in a case branch
- The default case is not necessarily the last case of a switch
- There can be nested switches inside a case of a switch
- There can be nested switches in a function definition present in a switch's discriminant:

  `switch(f(){switch(...){...}}){...}`
  
- There can be labeled break statements in a switch
- A break statement present in a case branch of a switch should not be necessarily the break associated with the case branch:

  `switch(...) { case 1: for(;;){break} }` or `switch(...) { case 1: {break} }`
  
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
