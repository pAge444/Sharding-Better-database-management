const express = require('express');

const authController = require('../controllers/auth');

const uploadController = require('../controllers/upload');

const searchController = require('../controllers/search');

const find_userController = require('../controllers/find_user');

const follow_userController = require('../controllers/follow');

const user_deleteController = require('../controllers/delete'); 

const update_controller = require('../controllers/update');


const router = express.Router();

router.get('/',authController.isLoggedIn,(req,res) => {
    //console.log(req.message);
    if( req.user ){
        console.log("djhfcusdf");
        res.render('index',{
            user : req.user
        });
    }
    else{
        console.log("oiuoiuoijoi");
        res.render('index');
    }
});

router.get('/register',(req, res) => {
    res.render('register');
});

router.get('/login',(req, res) => {
    res.render('login');
});

router.get('/profile',authController.profile,(req,res) => {
    //console.log(req.message);
    if( req.user ){
        res.render('profile',{
            user : req.user,
            files_1 : req.file,
            files_2 : req.file_1,
            files_3 : req.file_2,
            length : req.len,
            profile : req.profile,
            followers : req.f_ers,
            following : req.f_ing
        });
    } else {
        res.redirect('/login');
    }
});

router.post('/upload',uploadController.upload);
router.post('/profile',uploadController.profile_pic);

router.get('/find_user',find_userController.user,(req,res) => {
    if( req.user ){
        res.render('other_profile',{
            user : req.user,
            files_1 : req.file,
            files_2 : req.file_1,
            files_3 : req.file_2,
            length : req.len,
            profile : req.profile,
            followers : req.f_ers,
            following : req.f_ing,
            check : req.f_check,
            ori_user:req.ori_user
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/follow',follow_userController.follow);
router.get('/unfollow',follow_userController.unfollow);
router.get('/delete',user_deleteController.delete);
router.get('/delete_image',user_deleteController.delete_image);
router.get('/update',authController.isLoggedIn,(req,res) => {
    //console.log(req.message);
    if( req.user ){
        console.log("djhfcusdf");
        res.render('update',{
            user : req.user
        });
    }
    else{
        console.log("oiuoiuoijoi");
        res.render('index');
    }
});

router.post('/update',update_controller.update);

router.get('/search',authController.isLoggedIn,(req,res) => {
    if(req.user){
        res.render('search',{user:req.user});
    } else {
        res.redirect('/login');
    }
});

router.post('/search',searchController.search);

module.exports = router;