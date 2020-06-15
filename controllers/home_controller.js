const Post = require('../models/post');

module.exports.home = function(req,res){
    console.log(req.cookies);
    // Post.find({},function(err,posts){
    //     if(err){console.log("Error in getting post for home",err);return};
    //     return res.render('home',{
    //         title : 'home',
    //         posts : posts,
    //     });
    // });

    Post.find({}).populate('user').exec(function(err,posts){
        if(err){console.log("Error in getting post for home",err);return};
        return res.render('home',{
            title : 'home',
            posts : posts,
        });
    })
    

};



