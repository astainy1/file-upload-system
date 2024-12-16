module.exports.authUser = (req, res, next) => {
    if(req.session && req.session.userFound){

        next();
        
    }else{

        res.redirect('/?error=You%20Most$20Login%20First');
    }
};
