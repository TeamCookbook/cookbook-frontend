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
logger.debug("\n====Starting awesome server!====");


// Setup database connection
var dbConnection = new sequelize("cookbook", "root", "nOHHDvNc88WQddUjXPuo", {
    host: "localhost",
    dialect: "sqlite", // TODO: Switch to mysql or postgress or something
    pool: { max: 5, min: 0, idle: 10000 },
    storage: "./db/db.sqlite"
});

// App model definitions
var models = require("./models/sqlModels.js")(sequelize, dbConnection);
var modelCreations = [];
Object.keys(models).forEach(item =>{
    modelCreations.push(models[item].sync());
    //modelCreations.push(models[item].sync({force : true})); // Force will drop tables AKA delete all data!!
});

// Session storage model definitions
var sessionStoreInstance = new sequelizeSessionStorage({
    db: dbConnection
});
modelCreations.push(sessionStoreInstance.sync());

// Create/update models
Promise.all(modelCreations).then((/*values*/) => {
    // Create a test recipie
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
    // Frontend folder
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
        { webPath : "js-sha512",        realPath : "js-sha512" },
        { webPath : "popper",           realPath : "popper.js/dist/umd" }
    ].forEach((lib)=>{
        app.use(libWebRoot + lib.webPath, express.static(libRealRoot + lib.realPath));
    });

    // Api endpoints
    var endpointsArray = [
        require("./endpoints/users.js")(models)
    ];
    endpointsArray.forEach((endpointCollection) => {
        endpointCollection.forEach((endpoint) => {
            app[endpoint.verb]("/api" + endpoint.path, endpoint.handler);
        });
    });

    // Start server
    var server = app.listen(3000, function () {
        var host = server.address().address;
        var port = server.address().port;

        logger.debug("Web app listening at http://%s:%s", host, port);
    });
});


///////////////////////////////////////////////////////////
// Error handling & shutdown
function errorWithLineNumbers(err){
    var vStack = err.stack.split("\n"), vMaxDepth = 5;
    if(vStack.length < vMaxDepth) vMaxDepth = vStack.length;
    logger.debug("\n====ERROR====\n" + vStack[0]);
    for(var i = 1; i < vMaxDepth; i++){
        var vLine = vStack[i];
        var vStart = vLine.indexOf("/"), vEnd = vLine.indexOf(")");
        vEnd = (vEnd > -1)?vEnd:(vLine.length);
        //logger.debug("A: " + vStart + " B: " + vEnd + " " + vLine.substr(vStart, vEnd - vStart));
        logger.debug(vLine.substr(vStart, vEnd - vStart));
    }
    logger.debug("=============\n");
}

function shutDown(){
    logger.debug("\b\b====Shutting down...====\n");
    process.exit(0);
}
