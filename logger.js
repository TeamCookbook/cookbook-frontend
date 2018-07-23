module.exports = function(output, sql){
    return {
        debug : function(text) {
            // output(text);
        },
        error : function(text) {
            sql.create({
                content : text
            });
        }
    };
};
