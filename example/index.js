global.argv = require("../src/index");


global.argvObj = argv({
    firstName: ["fn", "pass your first name", "string", "Mary"],
    lastName: ["ln", "pass your last name", "string", "Sally"],
    age: ["a", "pass your age", "number", 21]
});

console.log(argvObj.parse(["--firstName", "Bob", "-ln", "Bill"]));
console.log(argvObj.parse(["--lastName", "Bobby"]));
console.log(argvObj.parse(["-a=47"]));
