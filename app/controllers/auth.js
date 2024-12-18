const bcrypt = require('bcrypt');
const db = require('../modals/db'); 
require('dotenv').config();
const saltRound = 12;
const { body, validationResult } = require('express-validator');
const { join } = require('path');

// Signup Page GET Request
exports.getSignup = (req, res) => {
    const success = req.flash('success');
    const error = req.flash('error');

    res.render('signup', {
        title: 'Sign Up | File Upload System',
        successMessage: success,
        errorMessage: error,
    });
};

// Signup Page POST Request with Validation
exports.postSignup = [

    body('username')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .isAlphanumeric().withMessage('Username must contain only letters and numbers'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/\d/).withMessage('Password must contain at least one number'),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg);
            req.flash('error', errorMessages.join(' | '));
            return res.redirect(303, '/signup');
        }

        const { username, email, password } = req.body;
        // Check if user exists
        const checkUserQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
        
        db.query(checkUserQuery, [username, email], (err, rows) => {
            
            if (err) {
                console.error(`Database error: ${err.message}`);
                req.flash('error', 'An unexpected error occurred. Please try again.');
                return res.redirect(303, '/signup');
            }
            
            if (rows.length > 0) {
                req.flash('error', 'Username or Email already exists!');
                return res.redirect(303, '/signup');
            }
            
            // Hash the password and insert user data
            bcrypt.hash(password, saltRound, (err, hashedPassword) => {

                if (err) {
                    console.error(`Error hashing password: ${err.message}`);
                    req.flash('error', 'An unexpected error occurred. Please try again.');
                    return res.redirect(303, '/signup');
                }
                
                const storeUserQuery = `INSERT INTO users(username, email, password) VALUES(?, ?, ?)`;
                
                db.query(storeUserQuery, [username, email, hashedPassword], (err, result) => {
                    
                    if (err) {
                        console.error(`Database error: ${err.message}`);
                        req.flash('error', 'An unexpected error occurred. Please try again.');
                        return res.redirect(303, '/signup');
                    }
                   
                    const signedUpUserID = result.insertId;
                    console.log(`Signup user id: ${signedUpUserID}`);

                    const defaultValues = `INSERT INTO user_profile(user_id, cover_photo, profile_image, full_name) 
                    VALUES(?, 'default_cover.jpg', 'default_profile_image.jpg', 'User') `;
                    
                    db.query(defaultValues, [signedUpUserID], (err) => {
                        if(err){
                            console.error(`Error inserting default values into user_profile table: ${err.message}`);
                            // req.flash('error', 'An unexpected error occurred. Please try again.');
                            res.redirect(303, '/signup');
                        }
                        console.log(`User ${username} has successfully signed up! with ID ${signedUpUserID}`);
                        req.flash('success', 'Sign Up Successful! Please log in.');
                        res.redirect(303, '/');
                    })

                });

            });
            
        });
    },
];

// Login Page GET Request
exports.getLogin = (req, res) => {
    const success = req.flash('success');
    const error = req.flash('error');

    res.render('login', {
        title: 'Login | File Upload System',
        successMessage: success,
        errorMessage: error,
    });
};

// Login Page POST Request
exports.postLogin = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.flash('error', 'Email and Password are required!');
        return res.redirect(303, '/?error=Missing%20Credentials');
    }

    const userDataQuery = `SELECT * FROM users WHERE email = ?`;
    db.query(userDataQuery, [email], (err, rows) => {
        if (err) {
            console.error(`Database error: ${err.message}`);
            req.flash('error', 'An unexpected error occurred. Please try again.');
            return res.redirect(303, '/?error=Database%20error');
        }

        if (rows.length === 0) {
            req.flash('error', 'User does not exist!');
            return res.redirect(303, '/?error=User%20not%20found');
        }

        const user = rows[0];
        bcrypt.compare(password, user.password, (err, isPasswordValid) => {
            if (err) {
                console.error(`Error comparing passwords: ${err.message}`);
                req.flash('error', 'An unexpected error occurred. Please try again.');
                return res.redirect(303, '/?error=Password%20error');
            }

            if (isPasswordValid) {
                req.session.userFound = { id: user.id, username: user.username, email: user.email };
                console.log(`User ${user.username} has successfully logged in!`);
                req.flash('success', 'You have successfully logged in!');
                res.redirect(303, '/dashboard');
            } else {
                req.flash('error', 'Incorrect password!');
                res.redirect(303, '/?error=Password%20does%20not%20match');
            }
        });
    });
};

// Logout Route
exports.logOut = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(`Error destroying session: ${err.message}`);
            res.redirect(303, '/dashboard');
        } else {
            console.log('User has logged out!');
            res.redirect(303, '/?logout=message');
        }
    });
};
