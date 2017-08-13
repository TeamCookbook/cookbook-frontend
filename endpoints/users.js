endpoint = require("./endpoint.js");
sha512 = require("js-sha512");

module.exports = [
	// GET all users
	endpoint.create("/users", "get", (req, res) => {
		res.send("Hello there, traveler");
	}),

	// POST new user
	endpoint.create("/users/new", "post", (req, res) => {
		res.send("Hello there, traveler");
	}),

	// Login endpoint
	endpoint.create("/login", "post", (req, res) => {
		if(!req.body) endpoint.error(400, "Missing request body", res);
		else if(!req.body.user) endpoint.error(400, "Missing username", res);
		else if(!req.body.pass) endpoint.error(400, "Missing password", res);
		else if(req.body.user != "martin") endpoint.error(401, "Wrong username or password", res);
		else if(sha512("test1234") !== req.body.pass) endpoint.error(401, "Wrong username or password", res);
		else res.send({status : "OK!"});
	})
];

