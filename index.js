///////////////////////////////////////////////////////////
// Includes

// Express
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var sessionStorage = require("./session.js");

// Process for loging functionality
var process = require('process');

//TODO: Write some better logging stuff which can be disabled
console.log("\n====Starting awesome server!====");

process.on('uncaughtException', errorWithLineNumbers);
process.on('SIGINT', shutDown);

// Setup Express
var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
// Session handling
app.use(session({
	secret: "ADD SECRET STRING HERE",
	store: sessionStorage(session.Store),
	resave: true,
	saveUninitialized: false
}));

app.use(express.static('public'));
app.use("/libs", express.static('node_modules')); //TODO: Don't expose all of node modules

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
