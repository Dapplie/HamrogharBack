const express = require('express');
const { signup, login } = require('../controllers/Auth');
const {OwnerAuthenticated, TenantAuthenticated, AdminAuthenticated} = require('../middlewares/auth');
const signupValidation = require('../validation/Signup');
const loginValidation = require('../validation/Login');
const { admin_info, get_owner_accounts, update_active_status, get_tenant_accounts, get_inactive_propreties, update_proprety_active_status } = require('../controllers/AdminAccount');

const Admin_router = express.Router();

Admin_router.get('/get_admin_info',AdminAuthenticated, admin_info);
Admin_router.get('/get_owner_accounts',AdminAuthenticated, get_owner_accounts);
Admin_router.post('/update_active_status',AdminAuthenticated, update_active_status);
Admin_router.get('/get_tenant_accounts',AdminAuthenticated, get_tenant_accounts);
Admin_router.get('/get_inactive_propreties', get_inactive_propreties);
Admin_router.post('/update_proprety_active_status',AdminAuthenticated, update_proprety_active_status);




module.exports = Admin_router;
