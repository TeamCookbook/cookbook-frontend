module.exports = (models) => {
    return {
        register: (userName, password) => {
            return models.users.create({
                userName: userName,
                password: password
            });
        }
    };
};
