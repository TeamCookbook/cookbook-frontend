var globals = require("./.globals.js");

module.exports = {
    "env" : {
        "es6" : true,
        "browser" : true
    },
    "globals" : globals,
    "extends" : "eslint:recommended",
    "parserOptions" : {
        "sourceType" : "module"
    },
    "rules" : {
        "indent" : [
            "error", 4,
            { "SwitchCase" : 1 }
        ],
        "linebreak-style" : [ "error", "unix" ],
        "quotes" : [ "error", "double" ],
        "semi" : [ "error", "always" ]
    }
};
