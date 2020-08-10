const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Like = require('../models/like');

module.exports.create = async function (req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        await post.populate('user', '-password').execPopulate();
        // to increase the user posts count
        let user = await User.findById(req.user._id); // ref PC1
        user.post = user.post + 1;
        user.save();
        // console.log(post);
        if (req.xhr) {

            return res.status(200).json({
                data: {
                    post: post,
                },
                message: "Post created",
            });
        }


        return res.redirect('back');
    } catch (error) {
        req.flash('error', error);
        console.log("Error in creating post ",error);
        return res.redirect('back');
    }

}

module.exports.destroy = async function (req, res) {
    try {
        
        let post = await Post.findById(req.params.id);
        let userId = post.user;
        
        if (post.user == req.user.id) {
            
            // delete all the likes of post and all likes of post comments too
            await Like.deleteMany({likeable : post, onMode : 'Post'});
            await Like.deleteMany({_id : {$in : post.comments}});

            post.remove();
            await Comment.deleteMany({post: req.params.id});

            let user = await User.findById(userId); // ref PC1
            user.post = user.post - 1;
            user.save();

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted successfuly"
                });
            }
            req.flash('success', 'Post deleted!');
            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }
        
    } catch (error) {
        console.log("Error", error);
        return res.redirect('back');
    }

}
