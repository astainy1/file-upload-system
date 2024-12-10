// Create various routes

//Login 
exports.getLogin = (req, res) => {
    //Get user data from database and compare to entered values

    res.render('login', {title: 'Login | File Upload System'});
}

exports.postLogin = (req, res) => {

    //Store user session
    res.redirect(303, '/dashboard');
}


//Sign up 
exports.getSignup = (req, res) => {
    res.render('signup', {title: 'Sign Up | File Upload System'});
}

exports.postSignup = (req, res) => {

    //Send user data into database

    res.redirect(303, '/');
}

// Profile
exports.getProfile = (req, res) => {
    res.render('profile', {title: 'Profile | file upload system', heading: 'Update your profile'});
};

//Dashboard
exports.getDashboard = (req, res) => {

    //Retrive user data from database, based on user session and id

    res.render('dashboard', {title: 'Dashboard | File Upload System', heading: 'All Files Uploaded'});
}

exports.postDashboard = (req, res) => {
    // Send information from dashboard
}

//Upload a file
exports.getUploadFile = (req, res) => {
    res.render('upload', {title: 'Upload | Upload File System', heading: 'Upload a file'});
}

exports.postUploadFile = (req, res) => {

}

// Document
exports.getDocument = (req, res) => {
    res.render('document', {title: 'Document | File Upload System', heading: 'All Document'});
};

exports.postDocument = (req, res) => {
    
};

//audio
exports.getAudio = (req, res) => {
    res.render('audio', {title: 'Audio file upload system', heading: 'All Audio file'});
}

exports.postAudio = (req, res) => {
    
}

//Film 
exports.getFilm = (req, res) => {
    res.render('film', {title: 'Film | File upload system', heading: 'All Film'});
}

exports.postFilm = (req, res) => {

}

//Image
exports.getImage = (req, res) => {
    res.render('image', {title: 'Image | File upload system', heading: 'All Images'});
}

exports.postImage = (req, res) => {

}

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