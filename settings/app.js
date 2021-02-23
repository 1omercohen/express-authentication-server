const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo').default;
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const flash = require('connect-flash');
const lusca = require('lusca');
const config = require("../config");
// six months expiration period specified in seconds
const SIX_MONTHS = 15778476;

const initial_server = () => {
    const User = mongoose.model("User");
    const server = express();
    server.use(express.json());
    server.use(express.json());
    server.use(cookieParser());
    server.use(flash());


    server.use(helmet.frameguard());
    server.use(helmet.xssFilter());
    server.use(helmet.noSniff());
    server.use(helmet.ieNoOpen());
    server.use(helmet.hsts({
        maxAge: SIX_MONTHS,
        includeSubdomains: true,
        force: true
    }));
    server.disable('x-powered-by');

    server.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        cookie: {
            maxAge: config.sessionCookie.maxAge,
            httpOnly: config.sessionCookie.httpOnly,
            secure: config.sessionCookie.secure && config.secure.ssl
        },
        name: config.sessionKey,
        store: MongoStore.create({
            mongoUrl: config.db_uri,
            clientPromise:  {useNewUrlParser: true, useUnifiedTopology: true},
            collectionName: config.sessionCollection
        })
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // Deserialize sessions
    passport.deserializeUser(function (id, done) {
        User.findOne({
            _id: id
        }, '-salt -password', function (err, user) {
            done(err, user);
        });
    });

    require("./passport_auth");
    server.use(passport.initialize());
    server.use(passport.session());
    server.use(lusca(config.csrf));

    server.use("/auth", require("../routes/auth"));

    server.use(function (err, req, res, next) {
        // If the error object doesn't exists
        if (!err) {
            return next();
        }

        // Log it
        console.error(err.stack);

        // Redirect to error page
        res.redirect('/server-error');
    });
    server.listen(config.port,() => {
        console.log('--');
        console.log('Environment:     ' + process.env.NODE_ENV);
        console.log('Server Port:     ' + config.port)
        console.log('Database:        ' + config.db_uri);
        console.log('--');
    });
}

module.exports = initial_server;
