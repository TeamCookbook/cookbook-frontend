angular.module("login", []).
	component("loginForm", {
		templateUrl: "/login/login-form.tmpl.html",
		controller: ["$http",
			function($http){
				var self = this;

				self.clearError = () => {
					self.error = null;
				};
				self.login = function() {
					if(!self.username || !self.password) self.error = "Please fill in all fields";
					else {
						console.log("WE ARE POSTING THIS SHIT");
						$http.post("/api/login", {
							user : self.username,
							pass : sha512(self.password)
						}).then((result) => {
							console.log(result);
						});
					}
				};
			}
		]
	});

