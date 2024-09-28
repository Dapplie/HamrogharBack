const mongoose = require('mongoose');

const AuthSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  selectedDate: {
    type: Date,
    default: Date.now
  },
  showDatePicker: {
    type: Boolean,
    default: false
  },
  idVerification: {
    type: String
  },
  location: {
    type: String
  },
  resetKey:{
    type:String
  }
});

const Auth = mongoose.model('Auth', AuthSchema);

module.exports = Auth;
