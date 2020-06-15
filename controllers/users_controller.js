const Users = require('../models/user');

module.exports.profile = function(req,res){
    return res.render('user_profile',{
        title : "user profile",
    });
};

module.exports.statics = function(req,res){
    return res.render('user_statics',{
        title : "user statics",
    });
};

module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title : "Sign Up",
    })
};

module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title : "Sign In",
    })
};
// get sign up data
module.exports.create = function(req,res){
    
    if(req.body.password != req.body.conform_password){
        return res.redirect('back');
    }

    Users.findOne({email : req.body.email},function(err,user){
        if(err){console.log("Error in finding the email for creating user");return};

        if(!user){
            Users.create(req.body, function(err,User){
                if(err){console.log("Error in creating user");return};
                
                return res.redirect('/users/sign-in');
            });
        }else{
            return res.redirect('/users/sign-in');
        }
    });
};
// sign in and create session for user
module.exports.createSession = function(req,res){
    return res.redirect('/');
}

// sign out
module.exports.distroySession = function(req,res){
    req.logout();
    return res.redirect('/');
}