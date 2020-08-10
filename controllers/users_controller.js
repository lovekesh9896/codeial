const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const ResetPassword = require('../models/password-reset');
const crypto = require('crypto');
const passwordResetMailer = require('../mailers/password_reset_mailer');

module.exports.profile = async function(req, res){
    let users = await User.find({});
    User.findById(req.params.id , function(err,user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user : user,
            all_users : users
        });
    });
    
}

module.exports.update = async function(req,res){
    try {
        if(req.user.id == req.params.id){
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){console.log("******* Multer : ", err);}
                user.name = req.body.name;
                user.email = req.user.email;
                user.profession = req.body.profession;
                user.about = req.body.about;
                
                if(req.file){
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '../', user.avatar));
                    }

                    // this is saving the path of uploaded file into the avatar feild in user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            })
        }
    } catch (err) {
        req.flash('error' , 'Unauthorized');
        return res.status(401).send('Unauthorized');
    }
   
        // User.findByIdAndUpdate(req.params.id , req.body, function(err,user){
        //     return res.redirect('back');
        // });
}


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.conform_password){
        return res.redirect('back');
    }
    // console.log(req.body);
    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfuly');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'Logged out Successfuly!');
    return res.redirect('/');
}

module.exports.forgotPassword = function(req,res){
    return res.render('forgot-password', {
        title: "Codeial | Forgot Password"
    })
}

module.exports.forgotPasswordMail = function(req,res){
    
    console.log("forgot email is ",req.body);
    User.findOne({email : req.body.email}, function(err, user){
        if(err){console.log("Error in reset password", err);
            req.flash('error', 'Internal Error! please try again later');
            return res.redirect('back');
        }
        if(!user){
            req.flash('error', 'Email does not found');
            console.log("Error in finding the user to reset password", err);
            return res.redirect('back');
            
        }else{
            let token = crypto.randomBytes(20).toString('hex');
            ResetPassword.create({
                user : user,
                accessToken : token,
            }, function(err,reset_info){
                if(err){
                    console.log("Error in creating reset_token ",err);
                    return;
                }
                console.log("reset_token is ",reset_info);
                passwordResetMailer.newResetLink(reset_info);
            });
            return res.redirect('back');
        }
    })
}

module.exports.resetLink = async function(req,res){
    try {
        let reset_info = await ResetPassword.findOne({accessToken : req.params.token});
        await reset_info.populate('user', 'name').execPopulate();
        if(!reset_info){
            return res.render('reset', {
                title: "Codeial | Reset Password",
                isValid : false,
            })
        }else{
            return res.render('reset', {
                title: "Codeial | Reset Password",
                isValid : true,
                reset_info : reset_info,
            });
        }
    } catch (err) {
        if(err){
            console.log("Error in reset page ",err);
            return;
        }   
    }
    
}

module.exports.reset = async function(req, res){
    console.log(req.body);
    if(req.body.new_password != req.body.conform_new_password){
        req.flash('error', "Password do not match");
        return res.redirect('back');
    }else{
        let user = await User.findById(req.body.user_id);
        user.password = req.body.new_password;
        user.save();
        req.flash('success', 'Password changed succesfuly');
        let token = await ResetPassword.findById(req.body.token_id);
        token.isValid = false;
        token.save();
        return res.redirect('/users/sign-in');
    }
}
