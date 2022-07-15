{
    // method to submit the form data for new post using AJAX

    
    let createPost = function () {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data) {
                    console.log(data);
                    let newPost = newPostDom(data.data.post , data.data.username, data.data.avatar);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                    new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        theme: "relax",
                        text: "Post published Successfully!",
                        type: "success",
                        layout: "topRight",
                        timeout: 1500,
                      }).show();

                      


                }, error: function (error) {
                    console.log(error.responseText);
                }
            });

        });
    }

    //method to create a post in DOM

    let newPostDom = function (post,username,avatar) {
        // console.log(post);
        return $(`<li id="post-${ post._id }" class = "particular-post">                
                
                <p>
                    <small>
                        <span>
                        
                        <img src="${ avatar }" alt="Img" style="width: 17px; border-radius: 50%;">

                        </span>
                        <span>
                        ${ username }
                        </span>
                    </small>
                
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${ post._id }">
                                <i class="fas fa-backspace" id="deleteicon"></i>
                            </a>
                        </small>
        
                            <div id="post-content">
                            ${ post.content }
                            </div>

                        <small>
                        
                        <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                            <i class="fas fa-thumbs-up"></i>        
                            0 Likes
                        </a>
                        
                        </small>
                </p>
        
                <div class="post-comments">
        
                        <form id="post-<%= post._id %>-comments-form" action="/comments/create" method="post">
                            <input type="text" name="content" placeholder="Type Here..." required>
                            <input type="hidden" name="post" value="${ post._id }">
                            <input type="submit" value="Add Comment" id="post-comment-button">
                        </form>
        
                            <div class="post-comments-list">
                                <ul id="post-comments-${ post._id } ">
        
                                    <h1>
                                        <i class="fas fa-comment"></i>
        
                                        ${ post.comments.length }  
                                            Comments
                                    </h1>
        
                                </ul>
                            </div>
        
                </div>
        
        
        </li>`);
    }

    // let newPostDom = function (post,username,avatar) {
    //     // console.log(post);
    //     return $(`<li id="post-${post._id}" class="particular-post">
  
    //         <p>
    //             <small>
    //                 <span>
    //                      if(`avatar`) {
    //                         <img src="=${ avatar }" alt="Img" style="width: 17px; border-radius: 50%;">
            
    //                      } else {
            
    //                         <i class="fas fa-user"></i>
            
    //                      } 
                        
    //                 </span>
    //                 <span>
    //                     ${username}
    //                 </span>
    //             </small>
    
    
    //                 <small>
    //                     <a class="delete-post-button" href="/posts/destroy/${ post._id }">
    //                         <i class="fas fa-backspace" id="deleteicon"></i>
    
    //                     </a>
    //                 </small>
    
    
    //                     <div id="post-content">
    //                         ${ post.content }
    //                     </div>
    //         </p>
    
    //         <div class="post-comments">
    
    //                 <form id="post-<%= post._id %>-comments-form" action="/comments/create" method="post">
    //                     <input type="text" name="content" placeholder="Type Here..." required>
    //                     <input type="hidden" name="post" value="${ post._id }">
    //                     <input type="submit" value="Add Comment" id="post-comment-button">
    //                 </form>
    
    
    //                     <div class="post-comments-list">
    //                         <ul id="post-comments-${ post._id }">
    
    //                             <h1>
    //                                 <i class="fas fa-comment"></i>
    
    //                                 ${ post.comments.length }

    //                                     Comments
    //                             </h1>
    
                                
    //                         </ul>
    //                     </div>
    
    //         </div>
    
    
    // </li>`);
    // }


    //method to delete a post from DOM

    let deletePost = function(deleteLink)
    {
        $(deleteLink).click(function(e)
        {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success:function(data){
                    $(`#post-${data.data.post_id}`).remove();

                    new Noty({
                        theme: "relax",
                        text: "Post and associated comments deleted!",
                        type: "success",
                        layout: "topRight",
                        timeout: 1500,
                      }).show();


                    // $(`#post-${ data.data.post._id }`).remove();
                },error:function(error){
                    console.log(error.responseText);

                }
            });
        });
    }


    createPost();


}