// Require sequelize to initialize models
module.exports = (sequelize, connection) =>{
	var models = {};
	
	models.users = connection.define("users", {
		userName: { type: sequelize.STRING, field: "username", primaryKey: true },
		password: { type: sequelize.STRING(128), field: "password" }
	}, { freezeTableName: true });

	models.recipies = connection.define("recipies", {
		id: { type: sequelize.INTEGER, field: "id", primaryKey: true },
		name: { type: sequelize.STRING(200), field: "name" },
		portions: { type: sequelize.INTEGER, field: "portions" },
		public: { type: sequelize.BOOLEAN, field: "public" },
		lastMade: { type: sequelize.DATE, field: "last_made" }
	}, { freezeTableName: true });

	models.recipieComments = connection.define("recipie_comments", {
		id: { type: sequelize.INTEGER, field: "id", primaryKey: true },
		recipieId: { type: sequelize.INTEGER, field: "recipie_id", references: {
			model: models.recipies, key: "id"
		} },
		timestamp: { type: sequelize.DATE, field: "timestamp" },
		comment: { type: sequelize.STRING, field: "comment" }
	}, { freezeTableName: true });

	models.recipieImages = connection.define("recipie_images", {
		id: { type: sequelize.INTEGER, field: "id", primaryKey: true },
		recipieId: { type: sequelize.INTEGER, field: "recipie_id", references: {
			model: models.recipies, key: "id"
		} },
		file: { type: sequelize.STRING, field: "file" },
		header: { type: sequelize.BOOLEAN, field: "header" }
	}, { freezeTableName: true });

	models.recipieSteps = connection.define("recipie_steps", {
		id: { type: sequelize.INTEGER, field: "id", primaryKey: true },
		recipieId: { type: sequelize.INTEGER, field: "recipie_id", references: {
			model: models.recipies, key: "id"
		} },
		description: { type: sequelize.STRING, field: "description" },
		sort: { type: sequelize.INTEGER, field: "sort" }
	}, { freezeTableName: true });

	models.recipieIngredientGroups = connection.define("recipie_ingredient_groups", {
		id: { type: sequelize.INTEGER, field: "id", primaryKey: true },
		recipieId: { type: sequelize.INTEGER, field: "recipie_id", references: {
			model: models.recipies, key: "id"
		} },
		name: { type: sequelize.STRING(200), field: "name" },
		sort: { type: sequelize.INTEGER, field: "sort" }
	}, { freezeTableName: true });

	models.ingredients = connection.define("ingredients", {
		id: { type: sequelize.INTEGER, field: "id", primaryKey: true },
		name: { type: sequelize.STRING(200), field: "name" },
		type: { type: sequelize.STRING(100), field: "type" },
		standardUnit: { type: sequelize.INTEGER, field: "standard_unit" }
	}, { freezeTableName: true });

	models.recipieIngredients = connection.define("recipie_ingredients", {
		id: { type: sequelize.INTEGER, field: "id", primaryKey: true },
		groupId: { type: sequelize.INTEGER, field: "recipie_group_id", references: {
			model: models.recipieIngredientGroups, key: "id"
		} },
		ingredientId: { type: sequelize.INTEGER, field: "ingredient_id", references: {
			model: models.ingredients, key: "id"
		} },
		amount: { type: sequelize.DECIMAL, field: "amount" },
		sort: { type: sequelize.INTEGER, field: "sort" }
	}, { freezeTableName: true });

	models.units = connection.define("units", {
		id: { type: sequelize.INTEGER, field: "id", primaryKey: true },
		name: { type: sequelize.STRING(200), field: "name" },
		denominator: { type: sequelize.STRING(100), field: "denominator" },
	}, { freezeTableName: true });

	return models;
};
