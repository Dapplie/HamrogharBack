const mongoose = require('mongoose');

const BookNowSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true
  },
  ownerId: {
    type: String,
    required: true
  },
  propertyId: {
    type: String,
    required: true
  },
  tenantFullName: {
    type: String,
    required: true
  },
  tenantMobileNum: {
    type: String,
    required: true
  },
  tenantEmail: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  ownerConfirmation: {
    type: Boolean,
    required: true
  },
  amount:{
    type:String,
  },
  methodOfPayment:{
    type:String,
  },
  comments:{
    type:String,
  },
  paymentsDue:{
    type:Date
  },
  paid: {
    type: Boolean,
    required: true
  },
  rating: {
    type: Number,
    required: false
  },
  received:{
    type: Boolean
  },
  reminder:{
    type:Boolean
  },
  dueReminder: {
    type:Boolean
  },
  reviewAuth : {
    type:Boolean
  },
  reviewText : {
    type:String
  }
});

const BookNow = mongoose.model('BookNow', BookNowSchema);

module.exports = BookNow;
