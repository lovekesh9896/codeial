const Post = require('../models/post');

module.exports.posts = function(req,res){
    return res.render('posts',{
        title : "posts",
    });
}


module.exports.createPost = function(req,res){
    Post.create({
        content : req.body.content,
        user : req.user._id,
    },function(err,post){
        if(err){
            console.log("error in creating the post",err);
            return;
        }
        return res.redirect('back');
    });
    
}