// right now email of twitter is not available to we can't sing -in users using twitter now
// when we deploy this will be available
const passport = require('passport');
const twitterStrategy = require('passport-twitter');
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new twitterStrategy({
    consumerKey: "LgI8KqCVyq78mBx989zDJZT8Y",
    consumerSecret: "eES2W5KP03JVJ0vNVj0qIic5Mb2RQP6GNAilmnpovtKnY4iUly",
    callbackURL: "http://127.0.0.1:8000/users/auth/twitter/callback",
    
  },
  function(token, tokenSecret, profile, done) {
        console.log("from line 14",profile);
        return done(null);
        // User.findOne({email : profile.emails[0].value}).exec(function(err,user){
        //     if(err){console.log("Error in facebook strategy passport in line 14",err); return;}
        //     if(user){
        //         return done(null , user);
        //     }else{
        //         User.create({
        //             name : profile.displayName,
        //             email : profile.emails[0].value,
        //             passport : crypto.randomBytes(20).toString('hex')
        //         }, function(err, user){
        //             if(err){console.log("Error in creating use facebook strategy passport in line 23", err); return;}
        //             return done(null, user);
        //         })
        //     }
        // })
  }
));


module.exports = passport;

