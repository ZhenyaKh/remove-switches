
function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

x = 3;

do {
    if (x === case1()) {
        console.log('case1');
        break;
        console.log('default');
        console.log('case2');
        break;
        break;
    }
    if (x === case2()) {
        console.log('case2');
        break;
        break;
    }
    console.log('default');
    console.log('case2');
    break;
    break;
} while (false);
