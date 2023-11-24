const express =require('express');
const router =express.Router();
authController=require('../controllers/auth')

router.get("/", authController.isLoggedIn,(req,res) => {
    res.render("index",{
        user:req.user
    });
});

router.get("/register",(req,res) => {
    res.render("register")
});

router.get("/login",(req,res) => {
    res.render("login")
});

// router.get('/', (req, res) => {
//     res.render('profile', { user: req.user });
// });

router.get("/profile",authController.isLoggedIn,(req,res) => {
    if (res.user){
        res.render('profile',{
            user:req.user
        })
    }else{
        res.redirect('/login')
    }
    
});



module.exports=router;