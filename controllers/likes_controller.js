const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.toggleLike = async function(req, res){
    try{

        // likes/toogle/?id=abcde&type=Post
        let likeable;
        let deleted = false;
        console.log(req.query);
        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }
        console.log(likeable);
        // check if like already exist
        let existingLike = await Like.findOne({
            likeable : req.query.id,
            onModel : req.query.type,
            user : req.user._id,
        });
        console.log(existingLike);
        // if like already exit delete it
        if(existingLike){
            console.log("here");
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted = true;
        }else{
            // else make a new like
            let newLike = await Like.create({
                user : req.user._id,
                likeable : req.query.id,
                onModel : req.query.type,
            });
            console.log(likeable);
            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.status(200).json({
            message : "request successful",
            data : {
                deleted : deleted,
            }
        })

    }catch(err){
        console.log(err);
        return res.status(501).json({
            message : "Internal Server Error",
        });
    }
}

