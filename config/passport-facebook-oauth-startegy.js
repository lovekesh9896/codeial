const passport = require('passport');
const facebookStrategy = require('passport-facebook');
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new facebookStrategy({
    clientID: "584680355547148",
    clientSecret: "2e1eca82a57a0b12807945b6a2eeedbc",
    callbackURL: "http://localhost:8000/users/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'gender','email']
  },
  function(accessToken, refreshToken, profile, done) {
        console.log("from line 14",profile);
        User.findOne({email : profile.emails[0].value}).exec(function(err,user){
            if(err){console.log("Error in facebook strategy passport in line 14",err); return;}
            if(user){
                return done(null , user);
            }else{
                User.create({
                    name : profile.displayName,
                    email : profile.emails[0].value,
                    passport : crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){console.log("Error in creating use facebook strategy passport in line 23", err); return;}
                    return done(null, user);
                })
            }
        })
  }
));


module.exports = passport;

