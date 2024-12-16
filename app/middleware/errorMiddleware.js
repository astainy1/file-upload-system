//Create custom 404 page
exports.notFound = (req, res, next) => {
    res.status(404);
    res.render('404', {title: '404 | File Upload System'});
}

//Create custom server error page
exports.serverError = (err, req, res, next) => {
    if(err){
        console.error(err.message);
        return;
    }else{
        res.status(500);
        res.render('500', { title: 'Server Error'});
    }
}