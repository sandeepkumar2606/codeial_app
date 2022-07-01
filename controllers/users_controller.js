const User = require('../models/user');
const fs = require('fs');
const path = require('path');


//donot convert into async wait. Lets keep as same as before, because there is no nesting level because there is 
//only one call back 

module.exports.profile=function(req,res)
{
    User.findById(req.params.id,function(err,user)
    {
        return res.render('user_profile',{
            title:"User Profile",
            profile_user: user
        });
    });
    
}



module.exports.update = async function(req,res)
{
    //This part is converted into async wait and also some part is also added when we add profile picture
    // if(req.user.id == req.params.id)
    // {
    //     User.findByIdAndUpdate(req.params.id , req.body , function(err,user)
    //     {
    //         req.flash('success','Details updated Successfully!!');

    //         return res.redirect('back');
    //     });
    // }
    // else
    // {
    //     req.flash('error','Unauthorized');
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id == req.params.id)
    {
        try
        {
            let user = await User.findById(req.params.id);

            User.uploadedAvatar(req,res,function(err){
                if(err)
                {
                    console.log('*******Multer Error:', err);
                    
                }

                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file)
                {

                    if(user.avatar)
                    {
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }

                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                user.save();
                req.flash('success','Details updated Successfully!');
                return res.redirect('back');
                
            });

        }
        catch(err)
        {
            req.flash('error',err);
            return res.redirect('back');
        }

    }
    else
    {
        req.flash('error','Unauthorized!');
        return res.status(401).send('Unauthorized');

    }
}


//render the signUp page
module.exports.signUp=function(req,res)
{
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    });
}

//render the signIn page
module.exports.signIn=function(req,res)
{
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in',{
        title:"Codeial | Sign In"
    });
}

//get up the sign up data
module.exports.create=function(req,res)
{
    if(req.body.password != req.body.confirm_password)
    {
        req.flash('error','Password and Confirm Password should be same!');
        return res.redirect('back');
    }

    User.findOne({email:req.body.email},function(err,user)
    {
        if(err){
            req.flash('error',err); 
            return ;
        }

        if(!user)
        {
            User.create(req.body,function(err,user)
            {
                if(err){

                    req.flash('error','Error in Signing Up User!');
                    console.log('error in creating user while signing up'); 
                    return;
                }

                req.flash('success','Account created Successfully!');
                return res.redirect('/users/sign-in');
            })
        }
        else
        {
            req.flash('info','Already registered email! Please sign up using different email.');
            return res.redirect('back');
        }
    })
}

//sign in and create a session for the user
module.exports.createSession=function(req,res)
{
    //we are putting the flash messages into the req so for putting the flash messages into res we have made 
    //a middleware in the config folder name middleware file which set the flash mssgs into the res

    req.flash('success','Logged in Successfully!');

    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    req.logout();

    req.flash('success','You have been logged out!');

    return res.redirect('/');
}