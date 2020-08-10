const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env = require('./environment');
const User = require('../models/user');

let opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : env.jwt_secret_key,

}

passport.use(new JWTstrategy(opts, function(jwtPayload, done){
    console.log(jwtPayload);
    User.findById(jwtPayload._id, function(err,user){
        if(err){console.log("Error in finding user from JWT",err); return}
        if(user){
            return done(null, user);
        }else{
            return done(null, false);
        }
    })

}));

module.exports = passport;