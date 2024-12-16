//Require install dependencies
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const ejs = require('ejs');
require('dotenv').config();
const flash = require('connect-flash');
const port = process.env.PORT || 5400;

//require common module
const handler = require('./routes/handler');
const auth = require('./controllers/auth');
const errorMiddleware = require('./middleware/errorMiddleware');

//Configure templete engine
app.set('view engine', 'ejs');	
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));

app.disable('X-Powered-By'); //Reduce fingerprinting
//Configure express body parser for parsing requests
app.use(bodyParser.urlencoded({ extended: true }));

//configure flash for feedback to user
app.use(flash());

//Configure express session
app.use(

    expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  //For development environment, set secure to false. In production, set it to true.  //Secure flag is set to false in development environment.
    
})
);

const authenticated = require('./middleware/authMiddleware');
// console.log(authenticated)
//Serve static files
app.use(express.static(path.join(__dirname, 'public')));

//Login handler
app.get('/', auth.getLogin);
app.post('/dashboard', auth.postLogin);
app.post('/logout', auth.logOut);

//Sign up handler
app.get('/signup', auth.getSignup);
app.post('/', auth.postSignup);

//Profile
app.get('/profile', authenticated.authUser, handler.getProfile);

//Edit profile
app.get('/editprofile', authenticated.authUser, handler.getEditProfile);
app.post('/profile', authenticated.authUser, handler.postEditProfile);

//Upload file handler
app.get('/upload', authenticated.authUser, handler.getUploadFile);

//Dashboard handler
app.get('/dashboard', authenticated.authUser, handler.getDashboard);

//Document handler
app.get('/document', authenticated.authUser, handler.getDocument);

//Audio handler
app.get('/audio', authenticated.authUser, handler.getAudio);

//File handler
app.get('/film', authenticated.authUser, handler.getFilm);

// Image
app.get('/image', authenticated.authUser, handler.getImage);


//Custom 404 
app.use(errorMiddleware.notFound);

//Custom 500
app.use(errorMiddleware.serverError);

//App listen on port
app.listen(port, (err) => {{
    if(err){
        console.log(err.message);
    }else{
        console.log(`Server is listening on port: (http://localhost:${port})
            Press Ctrl+C to stop the server....`);
    }
}})

