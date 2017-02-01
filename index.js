///////////////////////////////////////////////////////////
// Includes

// Database
var sequelize = require("sequelize");

// Express
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var sessionStorage = require("./session.js");

// Process for loging functionality
var process = require('process');

///////////////////////////////////////////////////////////
// Startup & Setup
process.on('uncaughtException', errorWithLineNumbers);
process.on('SIGINT', shutDown);
//TODO: Write some better logging stuff which can be disabled
console.log("\n====Starting awesome server!====");


// Setup database
var dbType = "sqlite"; // TODO: Switch to mysql or postgress or something

var connection = new sequelize("cookbook", "root", "nOHHDvNc88WQddUjXPuo", {
	host: "localhost",
	dialect: dbType,
	pool: { max: 5, min: 0, idle: 10000 },
	storage: "./db.sqlite"
});

var models = require("./models/sqlModels.js")(sequelize, connection);

var promises = [];
Object.keys(models).forEach(item =>{
	promises.push(models[item].sync());
});

Promise.all(promises).then(values => {
	console.log("Done creating tables!");
	/*models.recipies.create({
		name: "Random recipie #" + (Math.random() * 1000)
	});*/
});


// Setup Express
var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Session handling
app.use(session({
	secret: "MUhC1yZymZPYurctfjXF",
	store: sessionStorage(session.Store),
	resave: true,
	saveUninitialized: false
}));

app.use(express.static('public'));
app.use("/api", function(req, res){
	models.recipies.findAll().then((result) =>{
		var out = "";
		if(result){
			result.forEach((row) =>{
				out += JSON.stringify(row.toJSON());
			});
		}
		res.json(result);
	});
});

// Start server
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Web app listening at http://%s:%s', host, port);
});

//TODO: Decide if i need this
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
