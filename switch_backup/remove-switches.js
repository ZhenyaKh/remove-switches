const esprima = require('esprima');
const escodegen = require('escodegen');

function isSwitchStatement(node) {
    return node.type === 'SwitchStatement';
}

function getIfTest(left, right) {
    return { 
        type : 'BinaryExpression',
        operator : '===',
        left : left,
        right: right
    };
}

function getCaseFullConsequent(cases, startIndex) {
    return cases[startIndex].consequent;
}

function getIfStatement(switchStatement) {
    var result = {};
    var ifStatement = result;
    var defaultCase = { exists : false };

    for (i in switchStatement.cases) {
        var switchCase = switchStatement.cases[i];
        var isLastCase = (i == switchStatement.cases.length - 1);
        var caseFullConsequent = getCaseFullConsequent(switchStatement.cases, i);

        if (switchCase.test === null) {
            defaultCase = { exists : true, fullConsequent : caseFullConsequent };
            continue;
        }

        ifStatement.type = 'IfStatement';
        ifStatement.test = getIfTest(switchStatement.discriminant, switchCase.test);
        ifStatement.consequent = { type: 'BlockStatement', body: caseFullConsequent };
        ifStatement.alternate = (isLastCase && !defaultCase.exists) ? null : { };
        ifStatement = ifStatement.alternate;
    }

    if (defaultCase.exists) {
        ifStatement.type = 'BlockStatement';
        ifStatement.body = defaultCase.fullConsequent;
    }
    
    return result;
}

exports.removeSwitches = function(source) {
    var entries = []; 

    esprima.parseScript(source, { range : true }, function (node, meta) {
        if (isSwitchStatement(node)) { 
            var ifStatement = getIfStatement(node);
            console.log(ifStatement);
            console.log(escodegen.generate(ifStatement));
        }
    });
    
    return entries;
}

fs = require('fs')
fs.readFile('switch.js', 'utf8', function (err, source) {
    if (err) {
        return console.log(err);
    }

    try {
        fs.writeFile("if.js", exports.removeSwitches(source), function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("Result was saved to if.js");
        }); 
    }
    catch(err) {
        console.log(err);        
    }
});
