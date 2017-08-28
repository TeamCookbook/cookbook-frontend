const endpoint = require("./endpoint.js");
const crypto = require("crypto");

module.exports = (models) =>{
	return [
		// GET all users
		endpoint.create("/users", "get", (req, res) => {
			if(req.session.userLoggedIn) {
				res.send({status : "You are logged in!"});
			}else {
				res.send({status : "You are not authorized!"});
			}
		}),

		// TODO: This should obviously be authenticated!
		endpoint.create("/users/delete", "post", (req, res) => {
			if(!req.session.userLoggedIn) endpoint.error(401, "Unauthorized", res);
			else if(!req.body) endpoint.error(400, "Missing request body", res);
			else if(!req.body.user) endpoint.error(400, "Missing username", res);
			else {
				models.users.destroy({
					where : {
						userName : req.body.user
					}
				}).then(() => {
					res.send("OK THINK I GOT THAT.");
				});
			}
		}),

		// POST new user
		endpoint.create("/users/new", "post", (req, res) => {
			// TODO: Require authentication(?)
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
				models.users.findAll({
					where: {
						userName : req.body.user
					}
				}).then((result) => {
					var valid = false;
					if(result && result.length > 0) {
						var passAndSalt = sha512(req.body.pass, result[0].salt);
						if(passAndSalt.pwHash === result[0].password) {
							valid = true;
							endpoint.startSession(req, result[0].userName);
							res.send({status: "Yay, you did it! Now we need a session..."});
						}
					}else{
						// NOTE: We do this to "simulate" a password check,
						// so that password and username errors take roughly the same time
						// This way an intruder can't know if he has a correct username
						sha512(req.body.pass);
					}
					if(!valid){
						endpoint.stopSession(req);
						endpoint.error(401, "Wrong username or password", res);
					}
				});
			}
		}),

		// Log out
		endpoint.create("/logout", "post", (req, res) => {
			endpoint.stopSession(req);
			res.send(200);
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
	hash.update(text);
	return {
		salt : salt,
		pwHash : hash.digest("hex")
	};
}
