var app = angular.module("recipiesApp", []);

$.get("/api", (result) =>{
	console.log(result);
	if(result){
		result.forEach((row) =>{
			var ptag = $("<p>").appendTo("#thestuff");
			ptag.text(row.name);
		});
	}
});
