const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  senderId: {
    type: String,
    ref: 'User',
    required: true
  },
  recipientId: {
    type: String,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  propertyName: {
    type: String
  }, 
  received:{
    type:Boolean,
    default: false,
    required:true
  }
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
