const mysql = require('mysql2');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const { promisify } = require('util');

const db = require('../connection');

const { table } = require('console');

const path = require('path');

const publicDirectory = path.join(__dirname,'../public');

const fs = require('fs');

const query = require('./query');



exports.update = (req, res) => {

    let check = false;

    console.log(publicDirectory);
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const pwd = req.body.pwd;
    const pwdc = req.body.pwdc;
    //console.log(email);
    const tableName = query.register(email);
    //console.log(tableName);


        db.query('SELECT email FROM ?? WHERE email = ?',[tableName,email],async (error,results) => {
            if(error){
                console.log(error);
            }

            if(results.length > 0){
                return res.render('register',{
                    message : 'Email is already in use'
                });
            }
            else if(pwd !== pwdc){
                return res.render('register',{
                    message : 'Password do not match'
                });
            }


            db.query('UPDATE ?? SET ?',[tableName,{ fname : fname , lname : lname ,password : hpwd}], (error,results) => {
            if(error){
                console.log(error);
            }
            else{
                console.log(results);
            }
        });
    });
}