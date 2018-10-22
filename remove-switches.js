const esprima = require('esprima');
const escodegen = require('escodegen');

function getIfTest(left, right) {
    return { 
        type : 'BinaryExpression',
        operator : '===',
        left : left,
        right: right
    };
}

function generateIfStatements(switchStatement, casesStatements, casesOffsets, container) {
    for (i in switchStatement.cases) {
        var switchCase = switchStatement.cases[i];

        if (switchCase.test === null) {
            continue;
        }

        var ifStatement = {
            type : 'IfStatement',
            test : getIfTest(switchStatement.discriminant, switchCase.test),
            consequent : { type : 'BlockStatement', body : casesStatements.slice(casesOffsets[i]) },
            alternate : null
        };

        container.push(ifStatement);
    }    
}

function digestCases(cases, casesStatements, casesOffsets, defaultCase) {
    for (i in cases) {
        var caseOffset = casesStatements.length;
        var switchCase = cases[i];

        casesOffsets.push(caseOffset);

        if (switchCase.test === null) {
            defaultCase.exists = true;
            defaultCase.offset = caseOffset;
        }

        for (j in switchCase.consequent) {
            casesStatements.push(switchCase.consequent[j]);
        }
    }    
}

function updateNestingSwitch(entries, startIndex, nestedSwitchStart, nestedSwitchEnd, ifCode) {
    var length = entries.length;
    
    for (var i = startIndex; i < length; ++i) {
        if (entries[i].end >= nestedSwitchEnd) {
            var relativeNestedSwitchStart = nestedSwitchStart - entries[i].start;
            var relativeNestedSwitchEnd = nestedSwitchEnd - entries[i].start;
            var nestingSwitchCode = entries[i].code;

            entries[i].code = nestingSwitchCode.slice(0, relativeNestedSwitchStart) + 
                              ifCode +
                              nestingSwitchCode.slice(relativeNestedSwitchEnd);
            return true;
        }
    }
    
    return false;
}

function getIfStatements(switchStatement) {
    var result = { type : 'DoWhileStatement',
                   body : { type : 'BlockStatement', body : [] },
                   test : { type : 'Literal', value : false } };
    
    var casesStatements = [];    
    var casesOffsets = [];
    var defaultCase = { exists : false };

    digestCases(switchStatement.cases, casesStatements, casesOffsets, defaultCase);
    casesStatements.push({ type : 'BreakStatement', label : null});

    generateIfStatements(switchStatement, casesStatements, casesOffsets, result.body.body);
    
    if (defaultCase.exists) {
        result.body.body = result.body.body.concat(casesStatements.slice(defaultCase.offset));
    }

    return result;
}

function isSwitchStatement(node) {
    return node.type === 'SwitchStatement';
}

exports.removeSwitches = function(source) {
    var entries = []; 

    esprima.parseScript(source, { range : true }, function (node, meta) {
        if (isSwitchStatement(node)) {
            entries.push({
                code : source.slice(meta.start.offset, meta.end.offset), 
                start : meta.start.offset,
                end : meta.end.offset,
            });  
        }
    });

    entries.sort((a, b) => { return b.start - a.start });

    for (var i in entries) {
        var entry = entries[i];
        var ifStatements = getIfStatements(esprima.parseScript(entry.code).body[0]); 
        var ifCode = escodegen.generate(ifStatements);
        var isNested = updateNestingSwitch(entries, Number(i) + 1, entry.start, entry.end, ifCode);

        if (!isNested) {
            source = source.slice(0, entry.start) + ifCode + source.slice(entry.end);
        }
    }

    return source;
}

