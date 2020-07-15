const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res){
    try {
        let post = await Post.findById(req.body.post);
        // await post.populate('user','-password').execPopulate();
        // console.log("line 8",post);
        // console.log("line 9",req.body);
        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id,
            });
            await comment.populate('user','-password').execPopulate();
            // console.log("line 15",post);
            post.comments.push(comment);
            post.save();
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
                    message : "comment receved",
                });
            }
            res.redirect('/');
        }
    } catch (error) {
        console.log("yep in the create of comments",error);
        return res.redirect('back');
    }
    
}

module.exports.destroy = async function(req,res){
    try {
        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){
            let postid = comment.post;
            comment.remove();
            
            await Post.findByIdAndUpdate(postid , { $pull : {comments : req.params.id}});
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
            return res.redirect('back');
        }
    } catch (error) {
        console.log("yep in the destroy of comments",err);
        return res.redirect('back');
    }
    
}