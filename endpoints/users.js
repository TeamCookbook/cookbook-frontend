const endpoint = require("./endpoint.js");
const crypto = require("crypto");

module.exports = (models) =>{
	return [
		// GET all users
		endpoint.create("/users", "get", (req, res) => {
			res.send("Hello there, traveler");
		}),

		// POST new user
		endpoint.create("/users/new", "post", (req, res) => {
			// TODO: Require authentication(?)
			console.log("Register request!");
			if(!req.body) endpoint.error(400, "Missing request body", res);
			else if(!req.body.user) endpoint.error(400, "Missing username", res);
			else if(!req.body.pass) endpoint.error(400, "Missing password", res);
			else {
				var passAndSalt = sha512(req.body.pass);
				models.users.create({
					userName: req.body.user,
					password: passAndSalt.pwHash,
					salt: passAndSalt.salt
				});
				res.send({status : "User created successfully"});
			}
		}),

		// Login endpoint
		endpoint.create("/login", "post", (req, res) => {
			if(!req.body) endpoint.error(400, "Missing request body", res);
			else if(!req.body.user) endpoint.error(400, "Missing username", res);
			else if(!req.body.pass) endpoint.error(400, "Missing password", res);
			else {
				//models.users.create({userName : "flibflab"}).then(() => {
					models.users.findAll({

						where: {
							userName : req.body.user
						}
					}).then((result) => {
						res.send(result);
					});
				//});
				//res.send({status : "OK!"});
			}
		})
	];
};

function generateSalt(length){
	return crypto.randomBytes(Math.ceil(length/2))
		.toString("hex") /** convert to hexadecimal format */
		.slice(0,length);   /** return required number of characters */
}

function sha512(text, salt) {
	if(!salt) salt = generateSalt(128);
	var hash = crypto.createHmac("sha512", salt);
	return {
		salt : salt,
		pwHash : hash.digest("hex")
	};
}
