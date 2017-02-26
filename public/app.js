var app = angular.module("cookbook", [
	"ngRoute",
	"base",
	"recipies"
]).config(["$locationProvider", "$routeProvider",
	function ($locationProvider, $routeProvider){
		$locationProvider.hashPrefix("!");

		// Application sites
		$routeProvider.
			when("/recipies", {
				template: "<recipies-list></recipies-list>"
			}).
			otherwise("/recipies");
	}
]);

