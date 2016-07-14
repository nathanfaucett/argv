argv
=======

argv option parser


```javascript
var argv = require("@nathanfaucett/argv");


var optionsParser = argv({
    file: ["f", "start file", "string"],
    out: ["o", "out directory/file", "string"],
    ignore: ["i", "ignore paths", "array"],
    exportName: ["e", "export to global scope", "string"]
});

// if an array is not given uses process.argv.slice(2)
optionsParser.parse(); // returns object of parsed options
```
