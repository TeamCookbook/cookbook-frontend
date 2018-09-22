/* eslint-env node */
// This needs to fix if it's to work...
var express = require("express");

///////////////////////////////////////////////////////////
// Frontend folder
// Setup Express
var app = express();
app.use(express.static("./"));

var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Web app listening at http://%s:%s", host, port);
});
