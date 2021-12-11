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

exports.delete = async(req,res) => {
    console.log(req.cookies);
    if(req.cookies.jwt) {
        try {

            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            console.log(decoded);
            const user_ID = decoded.id;
            const tableName = query.register(user_ID);
            console.log(tableName);
            db.query('DELETE FROM ?? WHERE user_ID = ?',[tableName,user_ID],async(error,result) => {
                if(error){
                    console.log(error);
                    return;
                }else{
                    console.log(result);
                    const followers = user_ID + "_followers";
                    db.query('DROP TABLE ??',[followers],async(err,rst) => {
                        if(err){
                            console.log(err);
                            return;
                        }
                        console.log(rst);
                    });
                    const following = user_ID + "_following";
                    db.query('DROP TABLE ??',[following],async(err,rst) => {
                        if(err){
                            console.log(err);
                            return;
                        }
                        console.log(rst);
                    });

                    db.query('DELETE FROM users WHERE user_ID = ?',[user_ID],async(err,rst) => {
                        if(err){
                            console.log(error);
                            return;
                        }
                        console.log(rst);
                    });
                    const folderName = path.join(publicDirectory,'./uploads',`./${user_ID}`);
                    console.log(folderName);
                    try {
                        const removeDir = function(path) {
                            if (fs.existsSync(path)) {
                              const files = fs.readdirSync(path)
                          
                              if (files.length > 0) {
                                files.forEach(function(filename) {
                                  if (fs.statSync(path + "/" + filename).isDirectory()) {
                                    removeDir(path + "/" + filename)
                                  } else {
                                    fs.unlinkSync(path + "/" + filename)
                                  }
                                })
                                fs.rmdirSync(path)
                              } else {
                                fs.rmdirSync(path)
                              }
                            } else {
                              console.log("Directory path not found.")
                            }
                          }
                          
                          removeDir(folderName);
                          res.status(200).redirect("/auth/logout");
                        }
                    catch (err) {
                        console.error(err)
                    }
                }
            });
        } catch{
            console.log(error);
        }

    }
}
exports.delete_image = async(req,res) => {
    const file_name = req.param('file_name');
    console.log(file_name);
    const folderName = path.join(publicDirectory,file_name);
    console.log(folderName);
    console.log(folderName);
    try {
        fs.unlinkSync(folderName);
          res.status(200).redirect("/profile");
        }
    catch (err) {
        console.error(err)
    }
}

