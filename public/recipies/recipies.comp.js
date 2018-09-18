angular.module("recipies", []).
    component("recipiesList", {
        templateUrl: "/recipies/recipies.tmpl.html",
        controller: ["$http",
            function($http){
                var self = this;
                self.loading = true;

                $http.get("/api").then((result) =>{
                    if(result && result.data){
                        self.recipies = result.data;
                    }
                    self.loading = false;
                });
            }
        ]
    });
