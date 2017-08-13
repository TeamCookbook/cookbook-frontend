angular.module("login", []).
	component("loginForm", {
		templateUrl: "/login/login-form.tmpl.html",
		controller: ["$http",
			function($http){
				var self = this;


				self.login = function() {
					console.log(sha512(self.password));
					$http.post("/api/login", {
						user : self.username,
						pass : sha512(self.password)
					}).then((result) => {
						console.log(result);
					});
				};
			}
		]
	});

