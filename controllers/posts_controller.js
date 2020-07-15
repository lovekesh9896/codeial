const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
module.exports.create = async function (req, res) {
    console.log("line 5 from posts controller",req.body);

    try {
        let post = await Post.create({content: req.body.content, user: req.user._id});
        await post.populate('user', '-password').execPopulate();
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
        return res.redirect('back');
    }

}

module.exports.destroy = async function (req, res) {
    try {

        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id) {
            post.remove();
            await Comment.deleteMany({post: req.params.id});

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted successfuly"
                });
            }
        }
        req.flash('success', 'Post deleted!');
        return res.redirect('back');
    } catch (error) {
        req.flash('error', 'You can not delete it!');
        console.log("Error", error);
        return res.redirect('back');
    }

}
