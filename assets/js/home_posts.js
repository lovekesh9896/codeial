
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
                    deletePost($(' .delete-post-button', newPost));
                    // commentSetup();
                    new Noty({text: 'Post created succesfully', type: 'success', theme: "relax", timeout: "1500"}).show();
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
        <div id="post-${
            post._id
        }" class="one-post">
            
                <small class="delete-post">
                    <a class="delete-post-button" href="/posts/destroy/${
            post._id
        }"><span class="material-icons delete">delete</span></a>
                        
                            
                </small>
            
            <span class="post-content">${
            post.content
        } </span>
            <span class="post-author">${
            post.user.name
        }</span>
            <div class="comment-section">

            
                
                    <div class="comments">
                        <form action="/comments/create" class="create-comment-form" method="post" style="margin-top: 8px;">
                            <input type="text" name="content" class="comment-input" placeholder="Write Comments..." autocomplete=off>
                            <input type="hidden" name="post" value="${
            post._id
        }">
                            <button type="submit" class="comment-submit">Add</button>
                        </form>
                    </div>
                
                <div class="post-comments-list ">
                    <ul id="post-comments-${
            post._id
        }" >
                        
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
                    $(`#post-${
                        data.data.post_id
                    }`).remove();
                    commentSetup();
                    new Noty({text: 'Post deleted succesfully', type: 'success', theme: "relax", timeout: "1500"}).show();
                },
                error: function (error) {
                    new Noty({text: 'Error in deleting Post', type: 'error', theme: "relax", timeout: "1500"}).show();
                    console.log("Error", error);
                }
            });
        });
    }

    var deleteButtons = document.getElementsByClassName('delete');
    for (let i = 0; i < deleteButtons.length; i++) {
        $(deleteButtons[i]).click(function (event) {
            event.preventDefault();
            deletePost($(this).closest('a'));
        });
    }


    // comments section (insert/ delete)

    let deleteComment = function (deleteLink) {
        // $(deleteLink).click(function (e) {
            // e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#comment-${
                        data.data.comment_id
                    }`).remove();
                    
                    new Noty({text: 'Comment deleted succesfully', type: 'success', theme: "relax", timeout: "1500"}).show();
                },
                error: function (error) {
                    new Noty({text: 'Error in deleting comment', type: 'error', theme: "relax", timeout: "1500"}).show();
                    console.log("Error", error);
                }
            });
        // })
    }

    var deleteCommentClickHandler = function () {
        var deleteButtonsForComments = document.getElementsByClassName('delete-comment');
        for (let i = 0; i < deleteButtonsForComments.length; i++) {
            $(deleteButtonsForComments[i]).click(function (event) {
                console.log(event.target);
                event.preventDefault();
                deleteComment($(this).closest('a'));
            });
        }

    }


    let commentSetup = function () {
        let newCommentForm = document.getElementsByClassName('create-comment-form');
        var commentSubmit = document.getElementsByClassName('comment-submit');

        for (let i = 0; i < commentSubmit.length; i++) {
            $(commentSubmit[i]).click(function (e) {
                e.preventDefault();
                let newForm = $(newCommentForm[i]);
                $.ajax({
                    type: 'post',
                    url: 'comments/create',
                    data: newForm.serialize(),
                    success: function (data) {
                        let newComment = newCommentDOM(data.data);
                        var postId = "#post-comments-" + data.data.postId;
                        $(postId).prepend(newComment);
                        new Noty({text: 'Comment created succesfully', type: 'success', theme: "relax", timeout: "1500"}).show();
                        deleteCommentClickHandler(); // to refresh the click handler 
                        // $(newForm[0][0]).val("");
                    },
                    error: function (err) {
                        new Noty({text: 'Error in creating comment', type: 'success', theme: "relax", timeout: "1500"}).show();
                        console.log("Error", err.responseText);
                    }
                });
            });
        }

    }

    let newCommentDOM = function (comment) {
        console.log("line 174",comment);
        return $(`
        <li id="comment-${
            comment.id
        }" class="one-comment">
                    <span>
                        ${
            comment.content
        } 
                        <br>
                        <small>
                        ${
            comment.user
        }
                        </small>
                    </span>

                    <small class=" delete-comment">
                        <a class="delete-comment-button" href="/comments/destroy/${
            comment.id
        }"><span class="material-icons delete-comment">delete</span></a>    
                    </small>
                    
                </li>  `)
    }
    deleteCommentClickHandler();
    commentSetup();
    createPost();
}
