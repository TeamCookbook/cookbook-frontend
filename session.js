// Temp placeholder session handler
var vSessions = {};
module.exports = function(baseStore){
	class SessionHandler extends baseStore {
		destroy(sid, callback){
			vSessions[sid] = null;
			callback(null);
		}
		get(sid, callback){
			callback(null, vSessions[sid]);
		}
		set(sid, session, callback){
			vSessions[sid] = session;
			callback(null);
		}
	}

	return new SessionHandler();

};
