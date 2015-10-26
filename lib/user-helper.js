
var userHelper = {
    loggedIn : function( session ) {
        return session !== null && session.loggedIn === true && session.user ;
    },

    loggedInAsAdmin : function( session ) {
        return userHelper.loggedInAs( session, ["admin"] );
    },
    loggedInAsReviewer : function( session ) {
        return userHelper.loggedInAs( session, ["reviewer"] );
    },
    loggedInAsEditor : function( session ) {
        return userHelper.loggedInAs( session, ["editor"] );
    },

    loggedInAs : function( session, roles ) {
        if ( !userHelper.loggedIn(session) || !session.user.roles ) {
            return false;
        }

        for( var role in roles ) {
            if( !(role in session.user.roles) ) {
                return false;
            }
        }

        return true;
    }
};

module.exports = userHelper;