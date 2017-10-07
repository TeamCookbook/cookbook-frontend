angular.module("recipies", []).
    component("recipiesList", {
        templateUrl: "/recipies/recipies.tmpl.html",
        controller: ["$http",
            function($http){
                var self = this;
                self.loading = true;

                console.log("Loaded!");
                $http.get("/api").then((result) =>{
                    console.log(result);
                    if(result && result.data){
                        self.recipies = result.data;
                    }
                    self.loading = false;
                });
            }
        ]
    });

