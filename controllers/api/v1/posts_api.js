const Post = require('../../../models/post');
const Comment = require('../../../models/comment');
const User = require('../../../models/user');

// const { post } = require('../../../routes/api/v1');

module.exports.index = async function(req,res){
    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path : 'comments',
            populate : {
                path : 'user'
            }
        });
    return res.status(200).json({
        message : "list of posts",
        post : posts,
    });
}

module.exports.destroy = async function (req, res) {
    try {
        console.log(req.params.id);
        let post = await Post.findById(req.params.id);

        if(post.user == req.user.id){
            let userId = post.user;
        
        
            
            post.remove();
            await Comment.deleteMany({post: req.params.id});
            let user = await User.findById(userId);
            user.post = user.post - 1;
            user.save();
            return res.status(200).json({
                message : "Post and associated comments deleted",
            });
        }else{
            return res.status(401).json({
                message : "You can not delete this post",
            });
        }
        
        
        
    } catch (error) {
        console.log("error in line 49", error);
        return res.status(501).json({
            message : "Internal server error",
        });
    }

}
