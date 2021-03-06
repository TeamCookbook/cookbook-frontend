define(["sammy"], function(sammy){
    return sammy("#main", function() {
        var appContext = this;

        var views = [
            "front",
            "userinfo",
        ];

        appContext.get("#/", function(eventContext) {
            eventContext.redirect("#/front");
        });

        views.forEach(function(view) {
            appContext.get("#/" + view, function() {
                this.partial("views/" + view + ".html");
            });
        });
    });
});
