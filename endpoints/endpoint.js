// Check for testing if a method name is allowed
var methodNames = ["get", "post", "put", "delete"];
function validMethod(method) {
    return methodNames.indexOf(method) !== -1;
}

module.exports = {
    // Function for creating an expressJS friendly endpoint
    create : (path, method, handler) => {
        if(!path || ! handler || !validMethod(method)) return null;
        return {
            path : path,
            handler : handler,
            method : method
        };
    },

    // Shorthand for sending an error message
    error : (code, message, res) => {
        res.status(code).send({error: message});
    },

    // Function for starting a new session
    startSession : (req, username) => {
        req.session.userLoggedIn = true;
        req.session.currentUser = username;
    },

    // Kill the current session (log out)
    stopSession : (req) => {
        req.session.userLoggedIn = false;
        req.session.currentUser = null;
    }
};
