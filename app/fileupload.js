const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const port = process.env.PORT || 4000;

//import common module
const handler = require('./routes/handler');

//Configure templete engine
app.set('view engine', 'ejs');	
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));

//Configure express body parser for parsing requests
app.use(bodyParser.urlencoded({ extended: true }));

//Serve static files
app.use(express.static(path.join(__dirname, 'public')));

//Login handler
app.get('/', handler.getLogin);
app.post('/dashboard', handler.postLogin);

//Sign up handler
app.get('/signup', handler.getSignup);
app.post('/', handler.postSignup);

//Profile
app.get('/profile', handler.getProfile);

//Upload file handler
app.get('/upload', handler.getUploadFile);

//Dashboard handler
app.get('/dashboard', handler.getDashboard);

//Document handler
app.get('/document', handler.getDocument);

//Audio handler
app.get('/audio', handler.getAudio);

//File handler
app.get('/film', handler.getFilm);

// Image
app.get('/image', handler.getImage);


//Custom 404 
app.use(handler.notFound);

//Custom 500
app.use(handler.serverError);

//App listen on port
app.listen(port, (err) => {{
    if(err){
        console.log(err.message);
    }else{
        console.log(`Server is listening on port: (http://localhost:${port})
            Press Ctrl+C to stop the server....`);
    }
}})

