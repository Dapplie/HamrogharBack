const express = require('express');
const { signup, login, change_password, send_reset_key, reset_password, verifyEmail } = require('../controllers/Auth');
const {OwnerAuthenticated, TenantAuthenticated} = require('../middlewares/auth');
const signupValidation = require('../validation/Signup');
const loginValidation = require('../validation/Login');

const Router = express.Router();
// signupValidation,
Router.post('/signup',signupValidation, signup);
Router.post('/verify_email', verifyEmail);

Router.post('/login',loginValidation, login);
Router.post('/change_password', change_password);
// those two are for the forget password
Router.post('/send_reset_key', send_reset_key);
Router.post('/reset_password', reset_password);




module.exports = Router;
