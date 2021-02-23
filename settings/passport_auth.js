const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const constants = require("../constants");
const userController = require('../controllers/user');

passport.use(new GoogleStrategy({
        clientID: constants.GOOGLE_CLIENT_ID,
        clientSecret: constants.GOOGLE_CLIENT_SECRET,
        callbackURL: constants.GOOGLE_CALLBACK_URI,
        passReqToCallback: true,
        scope: ['https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
        ]
    },(req, accessToken, refreshToken, profile, done) => {
        const providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;

        const providerUserProfile = {
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            email: profile.emails[0].value,
            img_uri: (providerData.picture) ? providerData.picture : undefined,
            provider: 'google',
            providerIdentifierField: 'id',
            providerData: providerData
        };

        userController.saveOAuthUserProfile(req, providerUserProfile, done);
    }));

passport.use(new FacebookStrategy({
        clientID: constants.FACEBOOK_CLIENT_ID,
        clientSecret: constants.FACEBOOK_CLIENT_SECRET,
        callbackURL: constants.FACEBOOK_CALLBACK_URI,
        profileFields: ['id', 'name', 'displayName', 'emails', 'photos'],
        passReqToCallback: true,
        scope: ['email']
    }, (req, accessToken, refreshToken, profile, done) => {
        // Set the provider data and include tokens
        const providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;

        // Create the user OAuth profile
        const providerUserProfile = {
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            email: profile.emails ? profile.emails[0].value : undefined,
            img_uri: (profile.id) ? '//graph.facebook.com/' + profile.id + '/picture?type=large' : undefined,
            provider: 'facebook',
            providerIdentifierField: 'id',
            providerData: providerData
        };

        userController.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
