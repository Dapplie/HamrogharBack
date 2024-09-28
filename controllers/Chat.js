
const User = require('../models/Auth');
const Role = require('../models/Role');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const BookNow = require('../models/BookNow');
const Property = require('../models/RealEstate');
const Chat = require('../models/Chat');

const get_messages = async (req, res) => {
  const { recipientId } = req.body;
  console.log("recipient id")
  console.log(recipientId);
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'youtube');
  const senderId = decodedToken.userId;
console.log("jwt id");
console.log(senderId);
  try {
    const sentMessages = await Chat.find({ senderId, recipientId });
    const receivedMessages = await Chat.find({ senderId: recipientId, recipientId: senderId });
    const categorizedChats = { "sentMessages": sentMessages, "receivedMessages": receivedMessages };
    console.log("success getting");
    console.log(categorizedChats);
    res.status(200).json(categorizedChats);
  } catch (err) {
    console.log("error getting");
    res.status(500).json({ message: err.message });
  }
}

const send_message = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const decoded = jwt.verify(token, 'youtube');
  const senderId = decoded.userId;

  const { recipientId, message, timestamp, propertyName, received } = req.body;
console.log(req.body);
console.log("hi")
  try {
    const chat = new Chat({
      senderId,
      recipientId,
      message,
      timestamp,
      propertyName,
      received
    });

    await chat.save();
    res.status(201).send(chat);
  } catch (error) {
    res.status(400).send(error);
  }
}

const get_contacts_window = async (req, res) => {
  console.log("hiiiiiiiiiiiiiiiiiiiii")
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'youtube');
  const { userId, role } = decoded;
  try {
      const bookNowRecords = await BookNow.find({ $or: [{ tenantId: userId }, { ownerId: userId }] }).select('tenantId ownerId propertyId -_id');

      const promises = bookNowRecords.map(async (record) => {
          const [property, ownerInfo, tenantInfo] = await Promise.all([
              Property.findById(record.propertyId).select('name image location -_id'),
              User.findById(record.ownerId).select('name email phone -_id').lean(),
              User.findById(record.tenantId).select('name email phone -_id').lean()
          ]);

          let responseObj = { ...record._doc, property };
          if (role === 'owner') {
              responseObj.recipientId = record.tenantId;
              responseObj.recipientInfo = tenantInfo;
              delete responseObj.ownerId;
              delete responseObj.ownerInfo;
          } else if (role === 'tenant') {
              responseObj.recipientId = record.ownerId;
              responseObj.recipientInfo = ownerInfo;
              delete responseObj.tenantId;
              delete responseObj.tenantInfo;
          }

          return responseObj;
      });

      const results = await Promise.all(promises);
      console.log("success")
      res.json(results);
  } catch (error) {
    console.log("failed")
      res.status(500).json({ message: error.message });
  }
};

// nooooooooooooooo
// const get_recieved_messages = async (req, res) => {
//     try {
//       const token = req.headers.authorization.split(' ')[1]; // Extract JWT token from header
//       const decoded = jwt.verify(token, 'youtube'); // Verify and decode JWT token
//       const userId = decoded.userId; // Extract userId from decoded token
//       const messages = await Chat.find({ recipientId: userId }); // Search for messages
//       res.json(messages); // Return messages as JSON response
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Server Error' });
//     }
//   };

  // const get_sent_messages = async (req, res) => {
  //   try {
  //     const token = req.headers.authorization.split(' ')[1]; // Extract JWT token from header
  //     const decoded = jwt.verify(token, 'youtube'); // Verify and decode JWT token
  //     const userId = decoded.userId; // Extract userId from decoded token
  //     const messages = await Chat.find({ senderId: userId }); // Search for messages
  //     res.json(messages); // Return messages as JSON response
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ message: 'Server Error' });
  //   }
  // };
  
const first_owner_message = async (req, res) => {
    // Extract userId from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    let userId = '';
    if (token) {
        try {
            const decoded = jwt.verify(token, 'youtube');
            userId = decoded.userId;
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        return res.status(401).json({ message: 'Token not provided' });
    }

    // Extract tenantId, message, timestamp, and propertyName from request body
    const { tenantId, message, timestamp, propertyName } = req.body;

    try {
        // Create a new chat message
        const chat = new Chat({
            senderId: userId,
            recipientId: tenantId,
            message,
            timestamp,
            propertyName
        });

        // Save the chat message to the database
        await chat.save();

        // Respond with success message
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send message' });
    }
};

module.exports = { first_owner_message,   get_contacts_window, send_message, get_messages };
