const requirejs = require("requirejs");

requirejs.config({
    baseUrl: ".",
    paths : {
        "sammy" : "test/fakes/sammy"
    },
    nodeRequire : require
});

require("./test/app.js");
