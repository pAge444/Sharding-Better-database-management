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

exports.user = async(req,res,next) => {
    class Ultimate{
        constructor(user_name,user_ID,user_profile){
            this.user_ID = user_ID;
            this.user_name = user_name;
            this.user_profile = user_profile;
        }
    }
    const user_name = req.param('user_name');
    console.log(user_name);
    let ori_user_ID;
    console.log(req.cookies);
    if(req.cookies.jwt) {
        try {

            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            console.log(decoded);
            ori_user_ID = decoded.id;
        } catch{
            console.log(error);
        }

        db.query('SELECT user_ID FROM users WHERE user_name = ?',[user_name], async(error,result) => {
            console.log('dfsdfdfaf');
            if(error){
                console.log(error);
                return next();
            } 
            if(result.length > 0){
                console.log(result);
                const ID = result[0].user_ID;
                const tableName = query.register(ID);
                console.log(tableName);
                db.query('SELECT * FROM ?? WHERE user_ID = ?',[tableName,ID],(error,results) => {
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
                        });
                        console.log(followers);
                        db.query('SELECT * FROM ?? WHERE user_ID = ?',[followers,ori_user_ID],async(error,result)=>{
                            if(error){
                                console.log(error);
                            }
                            if(!result){
                                return next();
                            }
                            console.log(result.length);
                            req.f_check = result.length;
                        });

                        db.query('SELECT * FROM users WHERE user_ID = ?',[ori_user_ID],async(error,result)=>{
                            if(error){
                                console.log(error);
                            }
                            if(!result){
                                return next()
                            }
                            req.ori_user = result[0];
                            console.log("dhfsgdjf");
                            req.user = results[0];
                            return next();
                        })
                    }
                });

            }else{
                return next();
            }
        });
    }
}
