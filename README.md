# remove-switches

This JavaScript library makes translation of valid JavaScript code given as input in the following way: the library converts all switch statements present in the piece of code to loop and if statements. So, put simply, this library allows one to remove all switches from a JavaScript piece of code, while keeping the semantics of the code.

The thorough suite of unit-tests is also present in the repository and checks a really vast number of testing cases. 

The difficulty of the research problem is partly explained in the documentation file present in the repository.

## Dependencies

JavaScript libraries esprima and escodegen are already present in the repository.

## Usage

Usage of the library is extremely simple and can be seen in the file with the unit-tests. But the idea is present below.

```js
const switchRemoval = require("./remove-switches");
var newSourceString = switchRemoval.removeSwitches(oldSourceString);
```
