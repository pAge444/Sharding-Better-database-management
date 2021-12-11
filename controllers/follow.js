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

exports.follow = async(req,res) => {
    const user_name = req.param('user_name');
    console.log(user_name);
    let ori_user_ID;
    let ori_user_name;
    console.log(req.cookies);
    if(req.cookies.jwt) {
        try {

            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            console.log(decoded);
            ori_user_ID = decoded.id;
        } catch{
            console.log(error);
        }

        db.query('SELECT user_name FROM users WHERE user_ID = ?',[ori_user_ID], async(error,result) =>{
            if(error){
                console.log(error);
                return;
            }
            if(!result){
                return;
            }
            ori_user_name = result[0].user_name;
            console.log(ori_user_name);
        })

        db.query('SELECT user_ID FROM users WHERE user_name = ?',[user_name], async(error,result) => {
            console.log('dfsdfdfaf');
            if(error){
                console.log(error);
                return;
            } 
            if(result.length > 0){
                console.log(result);
                const ID = result[0].user_ID;
                const followers = ID + "_followers";
                db.query('INSERT INTO ?? SET ?',[followers,{user_ID : ori_user_ID, user_name : ori_user_name}],
                (err,rst) => {
                    if(err){
                        console.log(err);
                        return;
                    }
                    console.log(rst);
                });
                const following = ori_user_ID + "_following";
                db.query('INSERT INTO ?? SET ?',[following,{user_ID : ID, user_name : user_name}],
                (err,rst) => {
                    if(err){
                        console.log(err);
                        return;
                    }
                    console.log(rst);
                });

            }else{
                return next();
            }
        });
        res.status(200).redirect("/profile");
    }
}

exports.unfollow = async(req,res) => {
    const user_name = req.param('user_name');
    console.log(user_name);
    let ori_user_ID;
    let ori_user_name;
    console.log(req.cookies);
    if(req.cookies.jwt) {
        try {

            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            console.log(decoded);
            ori_user_ID = decoded.id;
        } catch{
            console.log(error);
        }

        db.query('SELECT user_name FROM users WHERE user_ID = ?',[ori_user_ID], async(error,result) =>{
            if(error){
                console.log(error);
                return;
            }
            if(!result){
                return;
            }
            ori_user_name = result[0].user_name;
            console.log(ori_user_name);
        })

        db.query('SELECT user_ID FROM users WHERE user_name = ?',[user_name], async(error,result) => {
            console.log('dfsdfdfaf');
            if(error){
                console.log(error);
                return;
            } 
            if(result.length > 0){
                console.log(result);
                const ID = result[0].user_ID;
                const followers = ID + "_followers";
                db.query('DELETE FROM ?? WHERE user_ID = ?',[followers,ori_user_ID],
                (err,rst) => {
                    if(err){
                        console.log(err);
                        return;
                    }
                    console.log(rst);
                });
                const following = ori_user_ID + "_following";
                db.query('DELETE FROM ?? WHERE user_ID = ?',[following,ID],
                (err,rst) => {
                    if(err){
                        console.log(err);
                        return;
                    }
                    console.log(rst);
                });

            }else{
                return next();
            }
        });
        res.status(200).redirect("/profile");
    }
}
