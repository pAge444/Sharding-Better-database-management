const express = require("express");

const app = express();

const path = require('path');

const dotenv = require('dotenv');

const cookieParser = require('cookie-parser');

dotenv.config({path: './.env'});

const mysql = require("mysql2");

const db = require('./connection');

const publicDirectory = path.join(__dirname,'./public');

//console.log(publicDirectory);

app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use(cookieParser());

app.set('view engine', 'hbs');

db.connect( (error) => {
    if(error){
        console.log(error);
    }
    else{
        console.log("MYSQL connected..........");
    }
});

app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));

app.listen(5000,() => {
    console.log("Server started on port 5000");
});