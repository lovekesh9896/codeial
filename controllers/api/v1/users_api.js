const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');

module.exports.createSession = async function(req, res){
    console.log("from line 5",req.body);
    try {
        let user = await User.findOne({email : req.body.email});
        if(!user || user.password != req.body.password){
             return res.status(501).json({
                 message : "Invalid username or passowrd",
             });

        }
        return res.status(200).json({
            message : "Sign in succesfull",
            data : {
                token : jwt.sign(user.toJSON(), env.jwt_secret_key, {expiresIn : 100000})
            }
        })
    } catch (error) {
        console.log("error in line 9", error);
        return res.status(501).json({
            message : "Internal server error",
        });
    }
    
}