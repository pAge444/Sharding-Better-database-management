const multer = require('multer');

const mysql = require('mysql2');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const { promisify } = require('util');

const db = require('../connection');

const { table, error } = require('console');

const path = require('path');

const publicDirectory = path.join(__dirname,'../public');

const fs = require('fs');

const query = require('./query');



exports.upload = async (req,res) => {
    console.log(req.cookies);
    if(req.cookies.jwt) {
        try {
            console.log(req.user_ID);
            
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            console.log(decoded);
            const tableName = query.register(decoded.id);
            console.log(tableName);

            db.query('SELECT user_ID,posts FROM ?? WHERE user_ID = ?',[tableName,decoded.id],(error,results) => {
                console.log(results);
                const user_ID = results[0].user_ID;
                let posts = results[0].posts;
                console.log(user_ID);

                if(results) {
                    //set storage Engine
                    const folderName = path.join(publicDirectory,'./uploads',`./${user_ID}`,'./posts');

                    console.log("vjxfsdjkvbfdjvgsdf");

                    console.log(folderName);

                    const storage = multer.diskStorage({
                        destination: folderName,
                        filename : function(req,file,cb)  {
                            cb(null,"post" + '-' + posts + path.extname(file.originalname));
                        }
                    });

                    console.log(storage);

                    const upload = multer({
                        storage: storage,
                        limits : {fileSize : 3000000000},
                        fileFilter : function(req, file, cb){
                            checkFileType(file, cb);
                        }
                    }).single('my_image');

                    console.log(upload);

                    function checkFileType(file, cb){
                        const fileType = /\.(jpg|jpeg|png|gif|mp4)$/;

                        console.log(file);

                        const extname = fileType.test(path.extname(file.originalname).toLowerCase());
                        console.log(extname);
                        
                        if(extname){
                            return cb(null,true);
                        } else {
                            return cb('Error : Images Only!');
                        }
                    }

                    upload(req,res,(err) => {
                        if(err){
                            res.render('profile',{
                                msg1 : err
                            });
                        } else {
                            if(req.file == undefined){
                                return res.render('profile',{
                                    msg1 : "Select image"});
                            }
                            console.log(req.file);
                            res.render('profile',{
                                msg1 : "Image uploaded"});
                        }
                    });
                    posts += 1;
                    db.query('UPDATE ?? SET ? WHERE user_ID=?',[tableName,{posts : posts},user_ID],(error,result)=>{
                        if(error){
                            console.log(error);
                            return;
                        }
                        console.log(results);
                    });
                }else{
                    console.log(error);
                    console.log('dsfsdfsdggsdv');
                }
            });

        } catch (error) {
            console.log(error);
        }
    }
    else{

    }
}
exports.profile_pic = async (req,res) => {
    console.log(req.cookies);
    if(req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            console.log(decoded);

            const user_ID = decoded.id;
 
            const folderName = path.join(publicDirectory,'./uploads',`./${user_ID}`,'./profile');

            console.log("vjxfsdjkvbfdjvgsdf");

            console.log(folderName);

            const storage = multer.diskStorage({
                destination: folderName,
                filename : function(req,file,cb)  {
                    cb(null,"profile_pic" + path.extname(file.originalname));
                }
            });

            console.log(storage);

            const upload = multer({
                storage: storage,
                limits : {fileSize : 3000000000},
                fileFilter : function(req, file, cb){
                    checkFileType(file, cb);
                }
            }).single('profile_pic');

            console.log(upload);

            function checkFileType(file, cb){

                const fileType = /\.(jpg|jpeg|png|gif)$/;

                console.log(file);

                const extname = fileType.test(path.extname(file.originalname).toLowerCase());
                console.log(extname);
                
                if(extname){
                    return cb(null,true);
                } else {
                    return cb('Error : Images Only!');
                }
            }

            upload(req,res,(err) => {
                if(err){
                    res.render('profile',{
                        msg1 : err
                    });
                } else {
                    console.log(req.file);
                    res.render('profile',{
                        msg1 : "Profile Changed"});
                }
            });
        }catch{
            console.log(error);
        }

    }
}

