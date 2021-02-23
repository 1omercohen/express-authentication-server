module.exports = {
    db_uri: 'mongodb://localhost:27017/test',//"mongodb://localhost:27017/heroku_auth",
    port:  3000,
    sessionCookie: {
        maxAge: 24 * (60 * 60 * 1000),
        httpOnly: true,
        secure: false
    },
    sessionSecret: 'Auth_Server',
    sessionKey: 'sessionId',
    sessionCollection: 'sessions',
    csrf: {
        csrf: false,
        csp: false,
        xframe: 'SAMEORIGIN',
        p3p: 'ABCDEF',
        xssProtection: true
    }
}
