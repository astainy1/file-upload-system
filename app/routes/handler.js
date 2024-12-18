const bcrypt = require('bcrypt');
const db = require('../modals/db');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const saltRound = 12;

// Set up multer for user profile
const profile = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/profile');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
        }
    })
}); 

//Set up multer for document upload
const document = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/document');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
})

// Create various routes

// Profile
exports.getProfile = (req, res) => {
    const username = req.session.userFound;
    // const userUsername = req.session.userFound;
    // console.log(username);

    //Join both user table and profile table to retrieve profile information
    const loggedInUserId = username.id;
    console.log(loggedInUserId);

    const userProfileDetails = `SELECT u.username, u.email,
    p.cover_photo, p.profile_image, p.full_name FROM users u LEFT JOIN user_profile p ON u.id = p.user_id WHERE u.id = ?`;
    
    // Query data for user info
    db.query(userProfileDetails, [loggedInUserId], (err, results) => {
        if(err){
            console.log(`Error retriving user details form user profile table: `, err.message);
            req.flash('error', 'An unexpected error occurred. Please try again.');
            return res.redirect(303, '/dashboard');
        }else{

            if(results.length === 0){
                console.log(`System error! please try again.`);
                req.flash('error', 'System error! please try again.');
                return res.redirect(303, '/dashboard');

            }else{
                
                const allinfoAboutUser = results[0];
                console.log('User details: ', allinfoAboutUser.full_name);
                res.render('profile', 
                    {
            
                    title: 'Profile | file upload system', 
                    heading: 'Profile Details',
                    profile: allinfoAboutUser
            
                    });
         }
        }
    })
};

//Get route for edit profile
exports.getEditProfile = (req, res) => {

        //Retrieve user id from session
        const username = req.session.userFound;

        //Join both user table and profile table to retrieve profile information
        const loggedInUserId = username.id;
        console.log(loggedInUserId);
    
        const userProfileDetails = `SELECT u.username, u.email, 
        p.cover_photo, p.profile_image, p.full_name FROM users u LEFT JOIN user_profile p ON u.id = p.user_id WHERE u.id = ?`;
        
        // Query data for user info
        db.query(userProfileDetails, [loggedInUserId], (err, results) => {
            if(err){
                console.log(`Error retriving user details form user profile table: `, err.message);
                req.flash('error', 'An unexpected error occurred. Please try again.');
                return res.redirect(303, '/dashboard');
            }else{
    
                if(results.length === 0){
                    console.log(`System error! please try again.`);
                    req.flash('error', 'System error! please try again.');
                    return res.redirect(303, '/dashboard');
    
                }else{
                    
                    const allinfoAboutUser = results[0];
                    console.log('User details: ', allinfoAboutUser.full_name);
                    res.render('profileUpdate', 
                        {
                
                        title: 'Update Profile | file upload system', 
                        heading: 'Update your profile',
                        profile: allinfoAboutUser
                
                        });
             }
            }
        })
};


exports.postEditProfile = [
    profile.fields([
        { name: 'profile_image', maxCount: 1 },
        { name: 'cover_photo', maxCount: 1 }
    ]),

    // Validation rules
    body('username')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .isAlphanumeric().withMessage('Username must contain only letters and numbers'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/\d/).withMessage('Password must contain at least one number'),

    async (req, res) => {
        try {
            // Extract user data
            const userID = req.session?.userFound?.id;
            const { email, username, fullname } = req.body;

            if (!userID) {
                req.flash('error', 'User not found. Please log in.');
                return res.redirect('/update');
            }

            console.log(`The ID to be updated is: ${userID}`);

            // Handle file uploads
            const profileImageFile = req.files?.profile_image?.[0];
            const coverPhotoFile = req.files?.cover_photo?.[0];

            const profileImage = profileImageFile
                ? path.basename(profileImageFile.path)
                : 'default_profile_image.jpg';
            const coverPhoto = coverPhotoFile
                ? path.basename(coverPhotoFile.path)
                : 'default_cover.jpg';

            console.log('Uploaded files:', { profileImage, coverPhoto });

            // Validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map(err => err.msg);
                req.flash('error', errorMessages.join(' | '));
                return res.redirect('/update');
            }

            // Hash password
            // const hashedPassword = await bcrypt.hash(password, 10);

            // Update user credentials
            const updateUserQuery = `UPDATE users SET email = ?, username = ? WHERE id = ?`;
            const userCredentials = [email,  username, userID];

            db.query(updateUserQuery, userCredentials, (err) => {
                if (err) {
                    console.error(`Error updating users table: ${err.message}`);
                    req.flash('error', 'Database error. Please try again.');
                    return res.redirect('/update');
                }

                // Update user profile
                const updateProfileQuery = `UPDATE user_profile SET full_name = ?, cover_photo = ?, profile_image = ? WHERE user_id = ?`;
                const profileData = [fullname, coverPhoto, profileImage, userID];

                db.query(updateProfileQuery, profileData, (err) => {
                    if (err) {
                        console.error(`Error updating user_profile: ${err.message}`);
                        req.flash('error', 'Database error. Please try again.');
                        return res.redirect('/update');
                    }

                    console.log(`User profile updated successfully for ID ${userID}`);
                    req.flash('success', 'Profile updated successfully!');
                    return res.redirect('/profile');
                });
            });
        } catch (error) {
            console.error(`Unexpected error: ${error.message}`);
            req.flash('error', 'An unexpected error occurred. Please try again.');
            return res.redirect('/update');
        }
    }
];







//Dashboard
exports.getDashboard = (req, res) => {
    const username = req.session.userFound;
    //Join both user table and profile table to retrieve profile information
    const loggedInUserId = username.id;
    console.log(loggedInUserId);

    const userProfileDetails = `SELECT u.username, u.email,
    p.cover_photo, p.profile_image, p.full_name FROM users u LEFT JOIN user_profile p ON u.id = p.user_id WHERE u.id = ?`;
    
    // Query data for user info
    db.query(userProfileDetails, [loggedInUserId], (err, results) => {
       
        if(err){

            console.log(`Error retriving user details form user profile table: `, err.message);
            req.flash('error', 'An unexpected error occurred. Please try again.');
            return res.redirect(303, '/dashboard');
        
        }else{

            if(results.length === 0){
                console.log(`System error! please try again.`);
                req.flash('error', 'System error! please try again.');
                return res.redirect(303, '/dashboard');

            }else{
                
                const allinfoAboutUser = results[0];
                console.log('User details: ', allinfoAboutUser);
                res.render('dashboard', 
                    {
            
                    title: 'Dashboard | file upload system', 
                    heading: 'Update your profile',
                    profile: allinfoAboutUser
            
                    });
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

