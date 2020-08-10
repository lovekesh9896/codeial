const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');
passport.use(new googleStrategy({
    clientID : env.google_client_id,
    clientSecret : env.google_client_secret,
    callbackURL : env.google_callback_url,

    },

    function(accessToken, refreshToken, profile, done){
        console.log("from line 14",profile);
        User.findOne({email : profile.emails[0].value}).exec(function(err,user){
            if(err){console.log("Error in google strategy passport in line 16",err); return;}
            if(user){
                return done(null , user);
            }else{
                User.create({
                    name : profile.name,
                    email : profile.emails[0],
                    password : crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){console.log("Error in creating use google strategy passport in line 25", err); return;}
                    return done(null, user);
                })
            }
        })
    }
));

module.exports = passport;