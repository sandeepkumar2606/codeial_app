const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

//These below create and destroy code is converted into async await because more callback function so we converted
//into async await so our code becomes neeter(async code is below these two codes create and destroy)

// module.exports.create = function(req,res)
// {
//     Post.create({
//         content:req.body.content,
//         user:req.user._id
//     },function(err,post)
//     {
//         if(err){console.log('error in creating a post'); return;}

//         return res.redirect('back');
//     });
// }

// module.exports.destroy = function(req,res)
// {
//     Post.findById(req.params.id,function(err,post)
//     {
//         //.id means converting the object id into string
//         if(post.user == req.user.id)
//         {
//             post.remove();

//             Comment.deleteMany({post : req.params.id},function(err)
//             {
//                 return res.redirect('back');
//             });
//         }
//         else{
//             return res.redirect('back');

//         }

//     });
// }



module.exports.create = async function(req,res)
{
    try
    {
        let post = await Post.create({
            content:req.body.content,
            user:req.user._id
        });

        let user = await User.findById(req.user._id);
        // console.log(user);
        
        if(req.xhr)
        {
            // console.log(post);
        // req.flash('success','Post Published Successfully!!');

        return res.status(200).json({
                data:{
                    post:post,
                    username:user.name,
                    avatar:user.avatar
                },
                message: "Post Created!"
            });
        }

        req.flash('success','Post Published Successfully!!');
        return res.redirect('back');

    }
    catch(err)
    {
        req.flash('error',err);
        return res.redirect('back');
    }
    
}

module.exports.destroy = async function(req,res)
{
    try
    {
        let post = await Post.findById(req.params.id);

        //.id means converting the object id into string
        if(post.user == req.user.id)
        {
            post.remove();

            await Comment.deleteMany({post : req.params.id});

            if(req.xhr)
            {
                return res.status(200).json({
                    data:{
                        post_id: req.params.id
                    },
                    message:"Post deleted"
                });
            }

            req.flash('success','Post and associated comments deleted!')

            return res.redirect('back');
        }
        else{

            req.flash('error','You cannot delete this Post');
            return res.redirect('back');

        }
    }
    catch(err)
    {
        req.flash('error',err);
        return res.redirect('back');
    }
}