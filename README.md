# remove-switches

This JavaScript library translates any piece of JavaScript code in such a way that all the switch-statements present in the piece of code would be converted to loop/if-statements. So put simply, the library allows one to get rid of all switch-statements in a JavaScript piece of code. 

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
