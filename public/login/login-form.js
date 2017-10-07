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
                        self.loading = true;
                        $http.post("/api/login", {
                            user : self.username,
                            pass : sha512(self.password)
                        }).then((result) => {
                            self.loading = false;
                            self.checkStatus();
                        }, (error) => {
                            self.loading = false;
                            self.checkStatus();
                        });
                    }
                };

                self.logout = function() {
                    self.loading = true;
                    $http.post("/api/logout").then((result) => {
                        self.loading = false;
                        self.checkStatus();
                    });
                };

                self.deleteUser = function() {
                    if(!self.username) self.error = "Tell me what user to delete!";
                    else {
                        self.loading = true;
                        $http.post("/api/users/delete", {
                            user : self.username
                        }).then((result) => {
                            self.loading = false;
                            self.checkStatus();
                        }, (error) => {
                            self.loading = false;
                            self.checkStatus();
                        });
                    }
                };

                self.checkStatus = function() {
                    self.loading = true;
                    $http.get("/api/users/me").then((result) => {
                        self.loading = false;
                        self.userStatus = "Logged in as " + result.data;
                    }, (error) => {
                        self.loading = false;
                        self.userStatus = error.data.error;
                    });
                };

                self.checkStatus();
            }
        ]
    });

