const express = require('express');
const { OwnerAuthenticated } = require('../middlewares/auth');
const {  get_message_notifications, get_notification_paid, get_notification_reminder, get_notification_reminder_payments_due } = require('../controllers/Notification');


const Notification = express.Router();
// get_notification_reminder_payments_due
Notification.get('/notification_message', get_message_notifications);
Notification.get('/notification_paid', get_notification_paid);
Notification.get('/notification_reminder', get_notification_reminder);
Notification.get('/get_notification_reminder_payments_due', get_notification_reminder_payments_due);






module.exports = Notification;
