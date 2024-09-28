const express = require('express');
const {OwnerAuthenticated, TenantAuthenticated, OwnerOrTenantAuthenticated, AdminAuthenticated} = require('../middlewares/auth');
const { add_book_now, get_non_confirmed_booking, owner_confirmation, get_confirmed_booking, set_fracture_details, update_paid_status, set_rating, set_review_text, get_review_text_reviewAuth_true, get_admin_review_text_reviewAuth_true, admin_deactivate_reviewAuth_to_false, owner_rejection } = require('../controllers/BookNow');

const BookNowRouter = express.Router();

BookNowRouter.post('/add_book_now',TenantAuthenticated, add_book_now);
// rejection
BookNowRouter.post('/reject_book_now',OwnerAuthenticated, owner_rejection);

BookNowRouter.get('/get_not_confirmed_booking',OwnerAuthenticated, get_non_confirmed_booking);
// set_fracture_details
BookNowRouter.get('/get_confirmed_booking',OwnerOrTenantAuthenticated, get_confirmed_booking);
BookNowRouter.post('/set_fracture_details',OwnerAuthenticated, set_fracture_details);
// paid update
BookNowRouter.post('/update_paid_status',OwnerAuthenticated, update_paid_status);

BookNowRouter.post('/set_rating',TenantAuthenticated, set_rating);
BookNowRouter.post('/set_review_text',TenantAuthenticated, set_review_text);
BookNowRouter.post('/get_review_text_reviewAuth_true',TenantAuthenticated, get_review_text_reviewAuth_true);
// admin_deactivate_reviewAuth_to_false
// fiewhfiejwfoirejfoijofiej ta7t
BookNowRouter.post('/admin_deactivate_reviewAuth_to_false',AdminAuthenticated, admin_deactivate_reviewAuth_to_false);

BookNowRouter.get('/get_admin_review_text_reviewAuth_true',AdminAuthenticated, get_admin_review_text_reviewAuth_true);


BookNowRouter.get('/get_not_confirmed_booking_tenant',TenantAuthenticated, get_non_confirmed_booking);
BookNowRouter.post('/owner_confirmation',OwnerAuthenticated, owner_confirmation);


// BookNowRouter.post('/login', login);



module.exports = BookNowRouter;
