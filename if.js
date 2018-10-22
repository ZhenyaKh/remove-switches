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

x = 1;
do {
    if (x === 1) {
        do {
            if (x === 1) {
                do {
                    if (x === 1) {
                        do {
                            if (x === 1) {
                                console.log('aaa');
                                break;
                            }
                        } while (false);
                        do {
                            if (x === 1) {
                                console.log('bbb');
                                break;
                            }
                        } while (false);
                        do {
                            if (x === 1) {
                                console.log('ccc');
                                break;
                            }
                        } while (false);
                        break;
                    }
                } while (false);
                do {
                    if (x === 1) {
                        console.log('ddd');
                        break;
                    }
                } while (false);
                break;
            }
        } while (false);
        break;
    }
} while (false);
    

var a =1;
