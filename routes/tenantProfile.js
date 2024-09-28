const express = require('express');
const { TenantAuthenticated } = require('../middlewares/auth');
const { add_preferences, get_preferences, get_user_by_id } = require('../controllers/tenantProfile');
const tenant_profile = express.Router();


tenant_profile.post('/add_preferences', TenantAuthenticated, add_preferences);
tenant_profile.get('/get_all_preferences',TenantAuthenticated, get_preferences);
tenant_profile.get('/get_user_by_id',TenantAuthenticated, get_user_by_id);


module.exports = tenant_profile;
