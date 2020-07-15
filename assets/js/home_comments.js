// { 
//     let commentSetup = function () {
//         let newCommentForm = document.getElementsByClassName('create-comment-form');
//         var commentSubmit = document.getElementsByClassName('comment-submit');

//         for (let i = 0; i < commentSubmit.length; i++) {
//             $(commentSubmit[i]).click(function (e) {
//                 e.preventDefault();
//                 let newForm = $(newCommentForm[i]);
//                 console.log(newForm);

//                 $.ajax({
//                     type: 'post',
//                     url: 'comments/create',
//                     data: newForm.serialize(),
//                     success: function (data) {
//                         let newComment = newCommentDOM(data.data);
//                         var postId = "#post-comments-" + data.data.postId;
//                         $(postId).prepend(newComment);
//                     },
//                     error: function (err) {
//                         console.log("Error", err.responseText);
//                     }
//                 });
//             });
//         }

//     }

//     let newCommentDOM = function (comment) {
//         console.log(comment);
//         return $(`
//         <li id="comment-${comment.id }" class="one-comment">
//                     <span>
//                         ${ comment.content } 
//                         <br>
//                         <small>
//                         ${ comment.user }
//                         </small>
//                     </span>

//                     <small class=" delete-comment">
//                         <a class="delete-comment-button" href="/comments/destroy/${ comment.id }"><span class="material-icons delete-comment">delete</span></a>    
//                     </small>
                    
//                 </li>  `)
//     }

//     // method to delete a comment from DOM
//     let deleteComment = function (deleteLink) {
//         $(deleteLink).click(function (e) {
//             e.preventDefault();

//             $.ajax({
//                 type: 'get',
//                 url: $(deleteLink).prop('href'),
//                 success: function (data) {
//                     $(`#comment-${
//                         data.data.id
//                     }`).remove();
//                     new Noty({text: 'comment deleted succesfully', type: 'success', theme: "relax", timeout: "1500"}).show();
//                 },
//                 error: function (error) {
//                     new Noty({text: 'Error in deleting comment', type: 'error', theme: "relax", timeout: "1500"}).show();
//                     console.log("Error", error);
//                 }
//             });
//         });
//     }
//     // commentSetup();

// }
