//syntax is module.exports.actionname=function(req,res){}

const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req,res)
{
    // console.log(req.cookies);
    // res.cookie('user_id',24);

    // Post.find({},function(err,posts)
    // {
    //     return res.render('home',{
    //         title:"Home",
    //         posts: posts
    //     });
    // });

    try
    {

        //populate the user of each post so that we can get the full user details using the user ObjectId so that we can display the user name which post the new post

        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path:'user'
            },
            populate:{
                path:'likes'
            }
        }).populate('likes');

        let users = await User.find({});

        return res.render('home',{
            title:"Home",
            posts: posts,
            all_users: users
        });

    }
    catch(err)
    {
        console.log('Error',err);
        return;
    }
    
}