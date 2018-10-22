function case1() {
    console.log("function case1() called");
    return 1;
}

function case2() {
    console.log("function case2() called");
    return 2;
}

x = 3;

switch (x) {
    case case1():
		console.log("case1");
    default:
		console.log("default");
    case case2():
		console.log("case2");
		break;
}

x = 1;
switch(x) {     
    case 1:	
        switch(x) {
    		case 1:
                switch(x) {
                    case 1:
                        switch(x) {
                            case 1:
                                console.log("aaa");                    
                        }  
                        switch(x) {
                            case 1:
                                console.log("bbb");                    
                        } 
                        switch(x) {
                            case 1:
                                console.log("ccc");                    
                        }                   
                }	
                switch(x) {
                    case 1:
                        console.log("ddd");                    
                }	
        }
}
    

var a =1;
