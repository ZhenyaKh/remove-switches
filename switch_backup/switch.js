function car () {
    console.log("car");
}

function foo () {
    console.log("foo");
}

function bar () {
    console.log("bar");
}

function blech () {
    console.log("blech");
}

var x = 3;

/*switch (x)
{
    case 1:
        car();
    case 2:
        foo();
        break;       

    case 3:
    case 4:
        bar();
        break;       

    default:
        blech();
        break;       
}*/

switch (x)
{
    default:
        foo();
        break;  
        
}
