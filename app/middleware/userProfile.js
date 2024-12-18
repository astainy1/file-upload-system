    //Join both user table and profile table to retrieve profile information
    const loggedInUserId = username.id;
    console.log(loggedInUserId);

    const userProfileDetails = `SELECT u.username, u.email, u.password, 
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
                    heading: 'Update your profile',
                    profile: allinfoAboutUser
            
                    });
         }
        }
    })