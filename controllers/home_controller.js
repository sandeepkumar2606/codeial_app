//syntax is module.exports.actionname=function(req,res){}

const Post = require('../models/post');

module.exports.home=function(req,res)
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

    //populate the user of each post so that we can get the full user details using the user ObjectId so that we can display the user name which post the new post
    Post.find({}).populate('user').exec(function(err,posts)
    {
        return res.render('home',{
            title:"Home",
            posts: posts
        });
    });

    
}