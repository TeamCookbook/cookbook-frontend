module.exports = {
    // Function for creating an expressJS friendly endpoint
    create : (path, verb, handler) => {
        if(!path || ! handler || !validVerb(verb)) return null;
        return {
            path : path,
            handler : handler,
            verb : verb
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

// Check for testing if a verb is allowed
function validVerb(verb) {
    return ["get", "post", "put", "delete"].indexOf(verb) !== -1;
}
