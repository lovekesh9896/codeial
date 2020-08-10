
class PostComments {

    constructor(postId){
        
        this.postId = postId;
        // console.log(`#post-${postId}-comments-form`);
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
            
        });
    }
    createComment(postId){
        let pSelf = this;
        // console.log(this.newCommentForm);
        this.newCommentForm.submit(function(e){
            console.log("post comments");
            
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data){
                    console.log(data.data);
                    let newComment = pSelf.newCommentDom(data.data);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));

                    // CHANGE :: enable the functionality of the toggle like button on the new comment
                    // new ToggleLike($(' .toggle-like-button', newComment));
                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });


        });
    }

    newCommentDom(comment){
        console.log(comment);
        return $(`
            <li id="comment-${comment.id}" class="one-comment">
                <span>${comment.content} 
                    <br>
                    <small>${comment.user}</small>
                </span>

                <small class=" delete-comment">
                    <a class="delete-comment-button" href="/comments/destroy/${comment.id}">
                        <span class="material-icons delete-comment">delete</span>
                    </a>    
                </small>
            </li>  
        `)
    }

    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }

    

}

