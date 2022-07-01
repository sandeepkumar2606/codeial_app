module.exports.setFlash = function(req,res,next)
{
    //putting the flash messages into the response
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error'),
        'info': req.flash('info')
    }

    next();
}