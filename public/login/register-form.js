angular.module("login").
    component("registerForm", {
        templateUrl: "/login/register-form.tmpl.html",
        controller: ["$http",
            function($http){
                var self = this;

                self.clearError = () => {
                    self.error = null;
                };
                self.register = () => {
                    if(!self.username || !self.password || !self.password2) self.error = "Please fill in all fields";
                    else if(self.password != self.password2) self.error = "Passwords doesn't match";
                    else {
                        $http.post("/api/users/new", {
                            user : self.username,
                            pass : sha512(self.password)
                        }).then((result) => {
                            console.log(result);
                            if(!result) self.error = "Unkown error";
                            else if(result.status != 200) self.error = result.data;
                            else self.success = result.data.status;
                        });
                    }
                };
            }
        ]
    });

