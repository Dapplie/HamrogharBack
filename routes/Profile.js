const express = require('express');
const { signup, login, owner_profile, owner_properties, owner_update_property, owner_delete_properties } = require('../controllers/OwnerProfile');
const { OwnerAuthenticated } = require('../middlewares/auth');


const Profile = express.Router();
// owner profile
Profile.get('/owner_profile', OwnerAuthenticated, owner_profile);
Profile.get('/owner_properties',OwnerAuthenticated, owner_properties);
Profile.post('/owner_update_properties/:_id', OwnerAuthenticated,owner_update_property);
Profile.post('/delete',OwnerAuthenticated, owner_delete_properties);





module.exports = Profile;
