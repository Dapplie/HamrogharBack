const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Chat = require('../models/Chat');
const User = require('../models/Auth');
const Property = require('../models/RealEstate');

const BookNow = require('../models/BookNow');
const get_notification_reminder_payments_due = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'youtube');
        const userId = decoded.userId;

        const fiveDaysFromNow = new Date();
        fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);

        const records = await BookNow.find({
            tenantId: userId,
            paymentsDue: { $lte: fiveDaysFromNow },
            ownerConfirmation: true,
            dueReminder: false
        });

        if (records.length > 0) {
            await BookNow.updateMany(
                {
                    tenantId: userId,
                    paymentsDue: { $lte: fiveDaysFromNow },
                    ownerConfirmation: true,
                    dueReminder: false
                },
                { $set: { dueReminder: true } }
            );
        }

        res.status(200).json({ success: true, records });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
}
const get_notification_reminder = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'youtube');
        const userId = decoded.userId;

        const fiveDaysFromNow = new Date();
        fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);

        const records = await BookNow.find({
            tenantId: userId,
            startDate: { $lte: fiveDaysFromNow },
            ownerConfirmation: true,
            reminder: false
        });

        if (records.length > 0) {
            await BookNow.updateMany(
                {
                    tenantId: userId,
                    startDate: { $lte: fiveDaysFromNow },
                    ownerConfirmation: true,
                    reminder: false
                },
                { $set: { reminder: true } }
            );
        }

        const detailedRecords = await Promise.all(records.map(async (record) => {
            const property = await Property.findById(record.propertyId);
            return {
                ...record.toObject(),
                propertyName: property ? property.name : 'Property not found'
            };
        }));

        res.status(200).json({ success: true, records: detailedRecords });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
    
}

const get_notification_paid = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'youtube');
    const userId = decoded.userId;

    try {
        const notifications = await BookNow.find({
            tenantId: userId,
            paid: true,
            received: false
        });

        if (notifications.length > 0) {
            await BookNow.updateMany(
                { tenantId: userId, paid: true, received: false },
                { $set: { received: true } }
            );

            const ownerId = notifications[0].ownerId;
            const propertyId = notifications[0].propertyId;

            const owner = await User.findOne({ _id: ownerId });
            const property = await Property.findOne({ _id: propertyId });

            res.status(200).json({
                notifications: notifications,
                owner: {
                    name: owner.name,
                    email: owner.email,
                    phone: owner.phone
                },
                property: {
                    name: property.name
                }
            });
        } else {
            res.status(200).json({ notifications: [] });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

const get_message_notifications = async (req, res) => {
    console.log("iufewhiufhiurehfieurohgiregirejfoijreofijrefjsfeisrgfoirejfoirejf")
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'youtube');
        const userId = decoded.userId;
console.log(userId);
        const chats = await Chat.find({ recipientId: userId, received: false });

        await Chat.updateMany(
            { recipientId: userId, received: false },
            { $set: { received: true } }
        );

        const senderIds = chats.map(chat => chat.senderId);
        const senders = await User.find({ _id: { $in: senderIds } }, { email: 1, name: 1, phone: 1 });

        const notifications = chats.map(chat => {
            const sender = senders.find(sender => sender._id.toString() === chat.senderId.toString());
            return { chat, sender };
        });
console.log(notifications);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {get_message_notifications, get_notification_paid, get_notification_reminder, get_notification_reminder_payments_due};