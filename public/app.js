var app = angular.module("cookbook", [
    "ngRoute",
    "base",
    "recipies",
    "login"
]).config(["$locationProvider", "$routeProvider",
    function ($locationProvider, $routeProvider){
        $locationProvider.hashPrefix("!");

        // Application sites
        $routeProvider.
            when("/recipies", {
                template: "<recipies-list></recipies-list>"
            }).
            when("/login", {
                template: "<login-form></login-form>"
            }).
            when("/register", {
                template: "<register-form></register-form>"
            }).
            otherwise("/recipies");
    }
]);

