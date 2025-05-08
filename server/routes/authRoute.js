const express = require('express');
const router = express.Router();
const {userRegister,userLogin,saveUserController} = require('../controllers/authController')


router.post('/signup',userRegister)
router.post('/login',userLogin)
router.post('/saveuser',saveUserController)

module.exports = router;
