///////////////////////////////////////////////////////////
// Includes

// Database
var sequelize = require("sequelize");

// Express
var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var sequelizeSessionStorage = require("connect-session-sequelize")(session.Store);

// Process for loging functionality
var process = require("process");
var logger = require("./logger.js")(process.stdout.write);

///////////////////////////////////////////////////////////
// Startup & Setup
//TODO: Write some better logging stuff which can be disabled
process.on("uncaughtException", errorWithLineNumbers);
process.on("SIGINT", shutDown);
console.log("\n====Starting awesome server!====");


// Setup database
var dbType = "sqlite"; // TODO: Switch to mysql or postgress or something

var connection = new sequelize("cookbook", "root", "nOHHDvNc88WQddUjXPuo", {
    host: "localhost",
    dialect: dbType,
    pool: { max: 5, min: 0, idle: 10000 },
    storage: "./db/db.sqlite"
});

var models = require("./models/sqlModels.js")(sequelize, connection);

var promises = [];
Object.keys(models).forEach(item =>{
    promises.push(models[item].sync());
    //promises.push(models[item].sync({force : true})); // Force will drop tables AKA delete all data!!
});

var sessionStoreInstance = new sequelizeSessionStorage({
    db: connection
});
promises.push(sessionStoreInstance.sync());

Promise.all(promises).then(() => {
    //console.log("Done creating tables!");
    /*models.recipies.create({
        name: "Random recipie #" + (Math.random() * 1000)
    });*/

    // Setup Express
    var app = express();
    app.use( bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    // Session handling
    app.use(session({
        secret: "MUhC1yZymZPYurctfjXF",
        store: sessionStoreInstance,
        resave: true,
        saveUninitialized: false
    }));

    ///////////////////////////////////////////////////////////
    // Server folders
    app.use(express.static("public"));

    // 3rd party library folders
    const libWebRoot = "/lib/", libRealRoot = "node_modules/";
    [
        { webPath : "bootstrap",        realPath : "bootstrap/dist" },
        { webPath : "jquery",           realPath : "jquery/dist" },
        { webPath : "tether",           realPath : "tether/dist" },
        { webPath : "angular",          realPath : "angular" },
        { webPath : "angular-resource", realPath : "angular-resource" },
        { webPath : "angular-route",    realPath : "angular-route" },
        { webPath : "js-sha512",        realPath : "js-sha512" }
    ].forEach((lib)=>{
        app.use(libWebRoot + lib.webPath, express.static(libRealRoot + lib.realPath));
    });


    // Express endpoints
    var endpointsArray = [
        require("./endpoints/users.js")(models)
    ];

    endpointsArray.forEach((endpointCollection) => {
        endpointCollection.forEach((endpoint) => {
            app[endpoint.method]("/api" + endpoint.path, endpoint.handler);
        });
    });

    // Start server
    var server = app.listen(3000, function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log("Web app listening at http://%s:%s", host, port);
    });
});



///////////////////////////////////////////////////////////
// Error handling & shutdown
function errorWithLineNumbers(err){
    var vStack = err.stack.split("\n"), vMaxDepth = 5;
    if(vStack.length < vMaxDepth) vMaxDepth = vStack.length;
    console.log("\n====ERROR====\n" + vStack[0]);
    for(var i = 1; i < vMaxDepth; i++){
        var vLine = vStack[i];
        var vStart = vLine.indexOf("/"), vEnd = vLine.indexOf(")");
        vEnd = (vEnd > -1)?vEnd:(vLine.length);
        //console.log("A: " + vStart + " B: " + vEnd + " " + vLine.substr(vStart, vEnd - vStart));
        console.log(vLine.substr(vStart, vEnd - vStart));
    }
    console.log("=============\n");
}

function shutDown(){
    console.log("\b\b====Shutting down...====\n");
    process.exit(0);
}
