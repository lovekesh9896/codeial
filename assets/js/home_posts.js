
{

    let createPost = function () {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function (e) {
            e.preventDefault();
            // $(newPostForm[0][0]).val(""); // to set input feild as empty
            
            $.ajax({
                type: 'post',
                url: 'posts/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    let newPost = newPostDom(data.data.post);
                    $('#posts-container').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost)); // don't know

                    // call the create comment class
                    new PostComments(data.data.post._id);

                    // CHANGE :: enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        text: 'Post created succesfully',
                        type: 'success', 
                        theme: "relax", 
                        timeout: "1500"
                    }).show();
                },
                error: function (err) {
                    new Noty({text: 'Error in creating post', type: 'error', theme: "relax", timeout: "1500"}).show();
                    console.log(err.responseText);
                }
            })
        });
    }
    // method to create  post in dom
    let newPostDom = function (post) {
        return $(`
        <div id="post-${post._id}" class="one-post">
            <small class="delete-post">
                    <a class="delete-post-button" href="/posts/destroy/${post._id}">
                        <span class="material-icons delete">delete</span>
                    </a>
            </small>
            <a class="toogle-like-button" data-likes="${ post.likes.length }" href="/likes/toogle/?id=${post._id}&type=Post">
                <span class="material-icons">favorite_border</span>
                <span>${ post.likes.length }</span>
            </a>
            <span class="post-content">${post.content} </span>
            <span class="post-author">${post.user.name}</span>
            
            <div class="comment-section">
                <div class="comments">
                    <form action="/comments/create" id="post-${ post._id }-comments-form" method="post" style="margin-top: 8px;">
                        <input type="text" name="content" class="comment-input" placeholder="Write Comments..." autocomplete=off>
                        <input type="hidden" name="post" value="${post._id}">
                        <button type="submit" class="comment-submit">Add</button>
                    </form>
                </div>
                
                <div class="post-comments-list ">
                    <ul id="post-comments-${post._id}" >
                        
                    </ul>
                </div>
            </div>
        </div>`)
    }

    // method to delete a post from DOM
    let deletePost = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#post-${data.data.post_id}`).remove();
                    commentSetup();
                    new Noty({
                        text: 'Post deleted succesfully', 
                        type: 'success', 
                        theme: "relax", 
                        timeout: "1500"
                    }).show();
                },
                error: function (error) {
                    new Noty({text: 'Error in deleting Post', type: 'error', theme: "relax", timeout: "1500"}).show();
                    console.log("Error", error);
                }
            });
        });
    }

    let convertPostsToAjax = function(){
        let onePost = document.getElementsByClassName('one-post');
        for(let i=0;i<onePost.length;i++){
            let self = $(onePost[i]);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        }
        // $('#posts-container .one-post').each(function(){
        //     let self = $(this);
        //     console.log(self);
        //     let deleteButton = $(' .delete-post-button', self);
        //     deletePost(deleteButton);
        //     console.log(deleteButton);
        //     // get the post's id by splitting the id attribute
        //     let postId = self.prop('id').split("-")[1]
        //     console.log(postId);
        //     new PostComments(postId);
        // });
    }

    createPost();
    convertPostsToAjax();
}
