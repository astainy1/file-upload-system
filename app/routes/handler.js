const bcrypt = require('bcrypt');
const db = require('../modals/db');
// Create various routes

// Profile
exports.getProfile = (req, res) => {
    const username = req.session.userFound;
    // const userUsername = req.session.userFound;
    console.log(username);
    res.render('profile', 
        {

        title: 'Profile | file upload system', 
        heading: 'Update your profile',
        loggedInUser: username

        });
};

//Get route for edit profile
exports.getEditProfile = (req, res) => {

    const username = req.session.userFound;
    // const userUsername = req.session.userFound;
    console.log(username);

    res.render('profileUpdate', 
        {

        title: 'Profile | file upload system', 
        heading: 'Update your profile',
        loggedInUser: username

        });
};

exports.postEditProfile = (req, res) => {
    
    res.redirect(303, '/profile');
}

//Dashboard
exports.getDashboard = (req, res) => {
    const id = req.session.userFound;
    console.log(`User with ${id.id} has logged in successfully`)
    //Retrive user data from database, based on user session and id
    const loggedInUserInfo = `SELECT * FROM users WHERE id = ?`;

    const getUserProfile = `SELECT * FROM userprofile WHERE user_id = ?`;
    const userID = id.id;

    //Query data for user info
    db.query(loggedInUserInfo, userID, (err, result) => {

                if(err) {
                    console.error(`Error getting user data from users table: ${err.message}`);
                }else{
                    if(result.length === 0) {
                        console.log(`User does not exist`);
                    }else{
                        console.log(result);
                        result.forEach((loggedUser) => {
                            const username = req.session.userFound;

                            console.log(`${loggedUser.username} has logged in to his/her dashboard`);
                            res.render('dashboard', 
                                {
                                    title: 'Dashboard | File Upload System', 
                                    heading: 'All Files Uploaded', 
                                    loggedInUser: username
                                });
                        })
                    }
                }
            })
}

exports.postDashboard = (req, res) => {
    // Send information from dashboard
}

//Upload a file
exports.getUploadFile = (req, res) => {

    const username = req.session.userFound;

    res.render('upload', 
        {
            title: 'Upload | Upload File System', 
            heading: 'Upload a file',
            loggedInUser: username
        });
}

exports.postUploadFile = (req, res) => {

}

// Document
exports.getDocument = (req, res) => {

    const username = req.session.userFound;

    res.render('document', 
        {
            title: 'Document | File Upload System', 
            heading: 'All Document',
            loggedInUser: username
        });
};

exports.postDocument = (req, res) => {
    
};

//audio
exports.getAudio = (req, res) => {

    const username = req.session.userFound;

    res.render('audio', 
        {
            title: 'Audio file upload system', 
            heading: 'All Audio file',
            loggedInUser: username
        });
}

exports.postAudio = (req, res) => {
    
}

//Film 
exports.getFilm = (req, res) => {

    const username = req.session.userFound;

    res.render('film', 
        {
            title: 'Film | File upload system', 
            heading: 'All Film',
            loggedInUser: username 
        });
}

exports.postFilm = (req, res) => {

}

//Image
exports.getImage = (req, res) => {
    const username = req.session.userFound;
    res.render('image', 
        {
            title: 'Image | File upload system', 
            heading: 'All Images',
            loggedInUser: username 
        });
}

exports.postImage = (req, res) => {

}

