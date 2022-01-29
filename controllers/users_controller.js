module.exports.profile=function(req,res)
{
    return res.render('home',{
        title:"profile"
    });
}


module.exports.contact=function(req,res)
{
    return res.render('home',{
        title:"contact"
    });
}