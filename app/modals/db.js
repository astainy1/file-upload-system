//Require mysql module
const mysql = require('mysql2');
//confiqure environment viriables
require('dotenv').config();

//Make connection to mysql server
const myConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

myConnection.connect((err) => {
    if(err){
        console.error(`Error connecting to database: ${err.message}`);
    }else{
        console.info(`Successfully connected to database: ${process.env.DB_DATABASE}`);
    }
})

module.exports = myConnection;