const express =require('express');
const router =express.Router();
const authController=require('../controllers/auth');
router.post("/register",authController.register);
router.post("/login",authController.login);
router.post("/profile",authController.profile);
router.get("/logout",authController.logout);

module.exports=router;
