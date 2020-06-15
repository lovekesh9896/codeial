const passport = require('passport');

const LocalPassport = require('passport-local').Strategy;
const User = require('../models/user');

// authentication using passport
passport.use(new LocalPassport({
        usernameField: 'email',
    }, function(email,password,done){
        // find a user and establish identity
        User.findOne({email : email},function(err,user){
            if(err){console.log("error in finding the user :: passport"); return done(err)};
            console.log("user is found");
            if(!user || user.password != password){
                console.log("Invalid user name password");
                return done(null,false);
            }
            return done(null, user);
        })
    }
));

// serializing the user which key is to be kept in the cookie
passport.serializeUser(function(user,done){
    done(null,user.id);
});

// deserializing the user from the key in the cookie
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){console.log("error in finding the user :: passport"); return done(err)};

        return done(null,user);
    });
});

// check if user is authencated
passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    // if user is not sign-in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        // res.user contains the current signed-in user form session cookie
        // and we are just sending it to locals for veiws
        res.locals.user = req.user;

    }
    next();
}

module.exports = passport;