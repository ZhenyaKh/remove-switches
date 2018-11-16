const esprima   = require('esprima');
const escodegen = require('escodegen');

function getIfTest(left, right) {
    return {
        type     : 'BinaryExpression',
        operator : '===',
        left     : left,
        right    : right
    };
}

function generateIfStatements(switchStatement, casesStatements, casesOffsets, discriminantVar,
                              container) {
    for (let i in switchStatement.cases) {
        const switchCase = switchStatement.cases[i];

        if (switchCase.test === null) {
            continue;
        }

        const ifStatement = {
            type       : 'IfStatement',
            test       : getIfTest({ type : 'Identifier', name : discriminantVar }, switchCase.test),
            consequent : { type : 'BlockStatement', body : casesStatements.slice(casesOffsets[i]) },
            alternate  : null
        };

        container.push(ifStatement);
    }
}

function digestCases(cases, casesStatements, casesOffsets, defaultCase) {
    for (let i in cases) {
        const caseOffset = casesStatements.length;
        const switchCase = cases[i];

        casesOffsets.push(caseOffset);

        if (switchCase.test === null) {
            defaultCase.exists = true;
            defaultCase.offset = caseOffset;
        }

        for (let j in switchCase.consequent) {
            casesStatements.push(switchCase.consequent[j]);
        }
    }
}

function nameGenerator() {
    /* https://gist.github.com/gordonbrander/2230317 */
    return '_' + Math.random().toString(36).substr(2, 9);
}

function getDiscriminantDeclaration(switchStatement, discriminantVar) {
    return { type         : 'VariableDeclaration',
             kind         : 'const',
             declarations : [ { type : 'VariableDeclarator',
                                id   : { type : 'Identifier', name : discriminantVar },
                                init : switchStatement.discriminant } ] };
}

function replaceSwitchNode(switchNode, ifStatements) {
    switchNode.type = ifStatements.type;
    switchNode.body = ifStatements.body;
    switchNode.test = ifStatements.test;

    delete switchNode.discriminant;
    delete switchNode.cases;
}

function getIfStatements(switchStatement) {
    const result = { type : 'DoWhileStatement',
                     body : { type : 'BlockStatement', body : [] },
                     test : { type : 'Literal', value : false } };

    let   casesStatements = [];
    let   casesOffsets    = [];
    let   defaultCase     = { exists : false };
    const discriminantVar = nameGenerator();

    digestCases(switchStatement.cases, casesStatements, casesOffsets, defaultCase);
    casesStatements.push({ type : 'BreakStatement', label : null});

    result.body.body.push(getDiscriminantDeclaration(switchStatement, discriminantVar));

    generateIfStatements(switchStatement, casesStatements, casesOffsets, discriminantVar,
        result.body.body);

    if (defaultCase.exists) {
        result.body.body = result.body.body.concat(casesStatements.slice(defaultCase.offset));
    }

    return result;
}

function isSwitchStatement(node) {
    return node.type === 'SwitchStatement';
}

exports.removeSwitches = function(source) {
    let entries = [];

    const syntaxTree = esprima.parseScript(source, { tolerant : true }, function (node) {
        if (isSwitchStatement(node)) {
            entries.push(node);
        }
    });

    for (let i in entries) {
        const ifStatements = getIfStatements(entries[i]);
        replaceSwitchNode(entries[i], ifStatements);
    }

    return escodegen.generate(syntaxTree);
};