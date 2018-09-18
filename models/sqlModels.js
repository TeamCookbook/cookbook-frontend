// Require sequelize to initialize models
module.exports = (sequelize, connection) =>{
    var models = {};

    ///////////////////////////////////////
    // Table definitions

    // Users
    models.users = connection.define("users", {
        userName: { type: sequelize.STRING, field: "username", primaryKey: true },
        password: { type: sequelize.STRING(128), field: "password" },
        salt: { type: sequelize.STRING(128), field: "salt" }
    }, { freezeTableName: true });

    // Recipes
    models.recipies = connection.define("recipies", {
        id: { type: sequelize.INTEGER, field: "id", primaryKey: true },
        name: { type: sequelize.STRING(200), field: "name" },
        portions: { type: sequelize.INTEGER, field: "portions" },
        public: { type: sequelize.BOOLEAN, field: "public" },
        lastMade: { type: sequelize.DATE, field: "last_made" }
    }, { freezeTableName: true });

    // Recipe comments
    models.recipieComments = connection.define("recipie_comments", {
        id: { type: sequelize.INTEGER, field: "id", primaryKey: true },
        recipieId: { type: sequelize.INTEGER, field: "recipie_id", references: {
            model: models.recipies, key: "id"
        } },
        timestamp: { type: sequelize.DATE, field: "timestamp" },
        comment: { type: sequelize.STRING, field: "comment" }
    }, { freezeTableName: true });

    // Recipe images
    models.recipieImages = connection.define("recipie_images", {
        id: { type: sequelize.INTEGER, field: "id", primaryKey: true },
        recipieId: { type: sequelize.INTEGER, field: "recipie_id", references: {
            model: models.recipies, key: "id"
        } },
        file: { type: sequelize.STRING, field: "file" },
        header: { type: sequelize.BOOLEAN, field: "header" }
    }, { freezeTableName: true });

    // Recipe steps
    models.recipieSteps = connection.define("recipie_steps", {
        id: { type: sequelize.INTEGER, field: "id", primaryKey: true },
        recipieId: { type: sequelize.INTEGER, field: "recipie_id", references: {
            model: models.recipies, key: "id"
        } },
        description: { type: sequelize.STRING, field: "description" },
        sort: { type: sequelize.INTEGER, field: "sort" }
    }, { freezeTableName: true });

    // Ingredient groups
    models.recipieIngredientGroups = connection.define("recipie_ingredient_groups", {
        id: { type: sequelize.INTEGER, field: "id", primaryKey: true },
        recipieId: { type: sequelize.INTEGER, field: "recipie_id", references: {
            model: models.recipies, key: "id"
        } },
        name: { type: sequelize.STRING(200), field: "name" },
        sort: { type: sequelize.INTEGER, field: "sort" }
    }, { freezeTableName: true });

    // Ignredients
    models.ingredients = connection.define("ingredients", {
        id: { type: sequelize.INTEGER, field: "id", primaryKey: true },
        name: { type: sequelize.STRING(200), field: "name" },
        type: { type: sequelize.STRING(100), field: "type" },
        standardUnit: { type: sequelize.INTEGER, field: "standard_unit" }
    }, { freezeTableName: true });

    // Recipe ingredients (links ingredients to recipes with amounts)
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

    // Unit definitions
    models.units = connection.define("units", {
        id: { type: sequelize.INTEGER, field: "id", primaryKey: true },
        name: { type: sequelize.STRING(200), field: "name" },
        denominator: { type: sequelize.STRING(100), field: "denominator" },
    }, { freezeTableName: true });

    models.log = connection.define("log", {
        id: { type: sequelize.INTEGER, field: "id", primaryKey: true },
        content: { type: sequelize.STRING(500), field: "content" },
    }, { freezeTableName: true });

    return models;
};
