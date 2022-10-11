
var jwt = require('jsonwebtoken');
var passport = require('passport');
var LoCalStrategy = require('passport-local').Strategy;
var expressJwt = require('express-jwt');
var sha512 = require('js-sha512');
var server_secret = 'flroad123123000';
const fs = require('fs');
var rawdata = fs.readFileSync('./query/social.json');
var queries = JSON.parse(rawdata);
var sql = require('./sql');

passport.use('local', new LoCalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, username, password, done) {
    password = sha512(password);

    return sql(queries.login, {
        user: username,
        pass: password,
        social_google: req.body.social_google
    }).then(result => {
        if (result !== null) 
            return done(null, result);
        else 
            return done(null, false);
        }
    );

}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = {
    passport: passport,
    check: expressJwt({secret: server_secret, algorithms:['RS256']}),
    generateToken(user) {
        return jwt.sign({
            user: user
        }, server_secret, {
            expiresIn: 120 * 60
        });

    }
}