
var userHelper = {
    loggedIn : function( session ) {
        return session !== null && session.loggedIn === true ;
    }
};

module.exports = userHelper;