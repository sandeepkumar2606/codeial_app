const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const User = require('../models/user');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
const Like = require('../models/like');

//This below code is converted to async await 

// module.exports.create = function(req,res)
// {
//     Post.findById(req.body.post, function(err,post)
//     {
//         if(post)
//         {
//             Comment.create({
//                 content:req.body.content,
//                 post:req.body.post,
//                 user:req.user._id
//             },function(err,comment)
//             {
//                 //handle error

//                 post.comments.push(comment);
//                 post.save();

//                 res.redirect('/');
//             });
//         }

//     });
// }


module.exports.create = async function(req,res)
{
    try
    {
        let post = await Post.findById(req.body.post);
        {
            if(post)
            {
                // console.log(req.user.email);
                let comment = await Comment.create({
                    content:req.body.content,
                    post:req.body.post,
                    user:req.user._id
                });
    

                    post.comments.push(comment);
                    post.save();
                    
                    comment = await comment.populate('user', 'name email');

                    // console.log(comment);

                    // commentsMailer.newComment(comment);

                    let job = queue.create('emails',comment).save(function(err)
                    {
                        if(err)
                        {
                            console.log('Error in sending to the queue',err);
                            return;
                        }

                        console.log('job enqueued',job.id);
                    });

                    req.flash('success','Commented Successfully!!');
    
                    return res.redirect('/');
            }
    
        }
    }
    catch(err)
    {
        req.flash('error',err);
        return res.redirect('back');
    }
}


//This below code is also converted into async await

// module.exports.destroy = function(req,res)
// {
//     Comment.findById(req.params.id,function(err,comment)
//     {
//         if(comment.user == req.user.id)
//         {
//             let postId = comment.post;

//             comment.remove();

//             Post.findByIdAndUpdate(postId, { $pull: {comments:req.params.id}},function(err,post){
//                 return res.redirect('back');
//             });
//         }
//         else
//         {
//             return res.redirect('back');
//         }
//     });
// }


module.exports.destroy = async function(req,res)
{
    try
    {
        let comment = await Comment.findById(req.params.id);
        {
            if(comment.user == req.user.id)
            {
                let postId = comment.post;
    
                // let post = await Post.findByIdAndUpdate(postId, { $pull: {comments:comment}});
    
                comment.remove();
    
                let post = await Post.findByIdAndUpdate(postId, { $pull: {comments:req.params.id}});
            
                await Like.deleteMany({likeable: comment._id, onModel:'Comment'});
                
                req.flash('success','Comment deleted Successfully!');
                
                return res.redirect('back');
                
            }
            else
            {
                req.flash('error','You cannot delete this comment!');
                return res.redirect('back');
            }
        }
    }
    catch(err)
    {
        req.flash('error',err);
        return res.redirect('back');
    }

}