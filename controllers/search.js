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

exports.search = async(req,res) => {
    console.log(req.body);

    const search = req.body.my_search;

    const find_user = search + "%";
    console.log(find_user);
    let user_ID;

    if(req.cookies.jwt) {
        try {

            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            console.log(decoded);
            user_ID = decoded.id;
        }catch{
            console.log(error);
        }
    }

    db.query('SELECT * FROM users WHERE user_name LIKE ? AND NOT user_ID = ? ',[find_user,user_ID],(error,results) => {
        if(error){
            console.log(error);
            return;
        }
        console.log(results);

        class Result{
            constructor(user_name,user_ID,user_profile){
                this.user_ID = user_ID;
                this.user_name = user_name;
                this.user_profile = user_profile;
            }
        }
        
        const result_of_search = []; 
        results.forEach(element => {
            const folderName = path.join(publicDirectory,'./uploads',`./${element.user_ID}`,'./profile');
            console.log(folderName);
            fs.readdir(folderName, function(err,files){
                if(err){
                    console.log(err);
                    return next();
                }
                const user_profile = path.join('./uploads',`./${element.user_ID}`,'./profile',`./${files[0]}`);
                console.log(user_profile);
                const find  = new Result(element.user_name,element.user_ID,user_profile);
                result_of_search.push(find);
            });
        });
        console.log(result_of_search); 

        return res.render('search',{ 
            results : result_of_search
        });
    })

}