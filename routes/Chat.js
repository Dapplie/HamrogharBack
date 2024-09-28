const express = require('express');
const { first_owner_message,  get_contacts_window, send_message, get_messages } = require('../controllers/Chat');
const { OwnerOrTenantAuthenticated } = require('../middlewares/auth');


const Chat = express.Router();
// owner profile
// Profile.get('/owner_profile', owner_profile);
// Profile.get('/owner_properties', owner_properties);
Chat.post('/first_owner_message',OwnerOrTenantAuthenticated, first_owner_message);
// extract the userId from the token and search for where it match recipientsId
// Chat.get('/get_recieved_messages', get_recieved_messages);

Chat.get('/get_contacts',OwnerOrTenantAuthenticated, get_contacts_window);
Chat.post('/send_message',OwnerOrTenantAuthenticated, send_message);
Chat.post('/get_messages',OwnerOrTenantAuthenticated, get_messages);




module.exports = Chat;
