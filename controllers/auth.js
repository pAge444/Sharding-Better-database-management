
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

exports.login = async (req, res) => {
    try {

        const email = req.body.email;
        const pwd = req.body.pwd;
        const tableName = query.register(email);

        if(!email || !pwd) {
            return res.status(400).render('login',{
                message : 'Please provide an email and password'
            });
        }

        db.query('SELECT user_ID, email, password FROM ?? WHERE email = ?',[tableName,email], async (error,results) => {
            //console.log(results);
            if(!results || !(await bcrypt.compare(pwd,results[0].password))){
                return res.status(401).render('login',{
                    message : 'Email or Password is incorrect'
                });
            } else {
                const id = results[0].user_ID;

                const token = jwt.sign({id}, process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is : " + token);

                const cookieOptions = {
                    expires : new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token , cookieOptions);
                res.status(200).redirect("/profile");
            }
        });
    }
    catch (error){
        console.log(error);
    }
}


exports.register = (req, res) => {

    let check = false;

    console.log(publicDirectory);
    const user_name = req.body.user_name;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const pwd = req.body.pwd;
    const pwdc = req.body.pwdc;
    //console.log(email);
    const tableName = query.register(email);
    //console.log(tableName);

    db.query('SELECT user_name FROM users WHERE user_name = ?',[user_name], async(error,results) => {
        if(error){
            console.log(error);
            return;
        }
        if(results.length > 0){
            return res.render('register',{
                message : 'User name is already in use'
            });
        }

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

            let hpwd = await bcrypt.hash(pwd, 8);
            console.log(hpwd);

            let user_ID = await (email[0].toUpperCase() + Number(new Date()));
            console.log(user_ID);


            db.query('INSERT INTO ?? SET ?',[tableName,{user_ID : user_ID, user_name : user_name, fname : fname , lname : lname , email : email , 
                password : hpwd}], (error,results) => {
                    if(error){
                        console.log(error);
                    }
                    else{
                        console.log(results);

                        db.query('INSERT INTO users SET ?',{user_name : user_name, user_ID:user_ID},(err,result)=>{
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log(result);
                                const followers = user_ID + "_followers";
                                console.log(followers); 
                                db.query('CREATE TABLE ?? (user_ID varchar(14),  user_name varchar(30), PRIMARY KEY (user_name))',[followers], async(error,results) => {
                                    if(error){
                                        console.log(error);
                                    }
                                    if(results){
                                        console.log("followers table is created");
                                        const following = user_ID + "_following";
                                        console.log(following); 
                                        db.query('CREATE TABLE ?? (user_ID varchar(14),  user_name varchar(30), PRIMARY KEY (user_name))',[following], async(error,results) => {
                                            if(error){
                                                console.log(error);
                                            }
                                            if(results){
                                                console.log("following table is created");
                                                const folderName = path.join(publicDirectory,'./uploads',`./${user_ID}`);
                                                console.log(folderName);
                                                try {
                                                    if (!fs.existsSync(folderName)) {
                                                    fs.mkdirSync(folderName);
                                                    console.log("Folder created");
                                                    if(!fs.existsSync(path.join(folderName,'./posts'))){
                                                        fs.mkdirSync(path.join(folderName,'./posts'));
                                                        console.log('Posts folder created');
                                                    }
                                                    if(!fs.existsSync(path.join(folderName,'./profile'))){
                                                        fs.mkdirSync(path.join(folderName,'./profile'));
                                                        console.log('Profile folder created');
                                                        return res.render('register',{
                                                            message : 'User registered'
                                                        });
                                                    }
                                                    }
                                                } catch (err) {
                                                    console.error(err)
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }

                });
        });
    });
}



exports.isLoggedIn = async (req, res, next) => {
    //req.message = "Inside middleware";
    console.log(req.cookies);
    if(req.cookies.jwt) {
        try {

            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            console.log(decoded);
            const tableName = query.register(decoded.id);
            console.log(tableName);

            db.query('SELECT * FROM ?? WHERE user_ID = ?',[tableName,decoded.id],(error,results) => {
                console.log(results);
                const user_ID =results[0].user_ID;
                if(!results) {
                    return next();
                } else {
                    req.user = results[0];
                    return next();
                }
            });

        } catch (error) {
            console.log(error);
        }
    }
    else{
        next();
    }
}

exports.profile = async (req, res, next) => {


    class Ultimate{
        constructor(user_name,user_ID,user_profile){
            this.user_ID = user_ID;
            this.user_name = user_name;
            this.user_profile = user_profile;
        }
    }
    //req.message = "Inside middleware";
    console.log(req.cookies);
    if(req.cookies.jwt) {
        try {

            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            console.log(decoded);
            const tableName = query.register(decoded.id);
            console.log(tableName);

            db.query('SELECT * FROM ?? WHERE user_ID = ?',[tableName,decoded.id],(error,results) => {
                console.log(results);
                const user_ID =results[0].user_ID;
                if(!results) {
                    return next();
                } else {
                    let images = [];
                    const folderName = path.join(publicDirectory,'./uploads',`./${user_ID}`,'./posts');
                    console.log(folderName);
                    fs.readdir(folderName, function(err,files){
                        if(err){
                            console.log(err);
                            return next();
                        }
                        files.forEach(function (file){
                            console.log(file);
                            images.push(path.join('./uploads',`./${user_ID}`,'./posts',`./${file}`));
                        });
                        console.log(images);
                        let images_1=[],images_2=[],images_3=[];
                        for(var i=0;i < images.length;i++){
                            images_1.push(images[i]);
                            images_2.push(images[++i]);
                            images_3.push(images[++i])
                        }
                        console.log(images_1);
                        console.log(images_2);
                        console.log(images_3);
                        req.file = images_1;
                        req.file_1=images_2;
                        req.file_2=images_3;
                        req.len = images.length;
                    });
                    let profile;
                    const profileName = path.join(publicDirectory,'./uploads',`./${user_ID}`,'./profile');
                    console.log(profileName);
                    fs.readdir(profileName, function(err,files){
                        if(err){
                            console.log(err);
                            return next();
                        }
                        profile = path.join('./uploads',`./${user_ID}`,'./profile',`./${files[0]}`);
                        req.profile = profile;
                    });
                    const following = user_ID + "_following";
                    console.log(following);
                    db.query('SELECT * FROM ??',[following],async(error,result)=>{
                        if(error){
                            console.log(error);
                        }
                        if(!result){
                            return next();
                        }
                        const result_of_following = [];
                        result.forEach(element => {
                            const folderName = path.join(publicDirectory,'./uploads',`./${element.user_ID}`,'./profile');
                            console.log(folderName);
                            fs.readdir(folderName, function(err,files){
                                if(err){
                                    console.log(err);
                                    return next();
                                }
                                const user_profile = path.join('./uploads',`./${element.user_ID}`,'./profile',`./${files[0]}`);
                                console.log(user_profile);
                                const find  = new Ultimate(element.user_name,element.user_ID,user_profile);
                                result_of_following.push(find);
                            });
                        });
                        console.log(result_of_following);
                        req.f_ing = result_of_following;
                    });

                    const followers = user_ID + "_followers";
                    console.log(followers);
                    db.query('SELECT * FROM ??',[followers],async(error,result)=>{
                        if(error){
                            console.log(error);
                        }
                        if(!result){
                            return next();
                        }
                        const result_of_followers = [];
                        result.forEach(element => {
                            const folderName = path.join(publicDirectory,'./uploads',`./${element.user_ID}`,'./profile');
                            console.log(folderName);
                            fs.readdir(folderName, function(err,files){
                                if(err){
                                    console.log(err);
                                    return next();
                                }
                                const user_profile = path.join('./uploads',`./${element.user_ID}`,'./profile',`./${files[0]}`);
                                console.log(user_profile);
                                const find  = new Ultimate(element.user_name,element.user_ID,user_profile);
                                result_of_followers.push(find);
                            });
                        });
                        console.log(result_of_followers);
                        req.f_ers = result_of_followers;
                        req.user = results[0];
                        return next();
                    });
                }
            });

        } catch (error) {
            console.log(error);
        }
    }
    else{
        next();
    }
}

exports.logout = async (req, res) => {


    const id = 1234;

    const token = jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    console.log("The token is : " + token);

        const cookieOptions = {
            expires : new Date( 2 * 1000),
            httpOnly: true
        }

    res.cookie('jwt', token , cookieOptions);


    res.status(200).redirect("/");
}
