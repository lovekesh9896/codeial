const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const Like = require('../models/like');

// const nodemailer = require('../config/nodemailer');
const commentMailer =  require('../mailers/comments_mailer');
const commentEmaillWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');


module.exports.create = async function(req, res){
    try {
        let post = await Post.findById(req.body.post);
        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id,
            });
            // to increase the user comments count ref CC1
            let user = await User.findById(comment.user);
            user.comments = user.comments + 1;
            user.save();

            post.comments.push(comment);
            post.save();

            await comment.populate('user','-password').execPopulate();

            // commentMailer.newComment(comment);
            // let job = queue.create('emails', comment).save(function(err){
            //     if(err){console.log("Error in creating the for comments queue", err); return}
            //     console.log("job id for comments mailer queue",job.id);
            // });
            // to update comment in real time
            if(req.xhr){
                console.log("line 22",req.body);
                return res.status(200).json({
                    data : {
                        content : req.body.content,
                        user : comment.user.name,
                        postId : req.body.post,
                        id : comment._id,
                    },
                    message : "Comment Created",
                });
            }
            res.redirect('/');
        }
    } catch (error) {
        console.log("Error in creating comments",error);
        return res.redirect('back');
    }
    
}

module.exports.destroy = async function(req,res){
    try {
        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){
            let postId = comment.post;
            // to decrease user comment count ref CC1
            let user = await User.findById(comment.user);
            user.comments = user.comments - 1;
            user.save();

            comment.remove();
            // to remove the comment id from the post comments array
            await Post.findByIdAndUpdate(postId , { $pull : {comments : req.params.id}});
            // destroy the likes of a comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id,
                    },
                    message: "Comment deleted successfuly"
                });
            }
            return res.redirect('back');

        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    } catch (error) {
        console.log("Error in destroing comments",error);
        return res.redirect('back');
    }
    
}