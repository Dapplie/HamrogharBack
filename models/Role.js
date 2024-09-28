const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  locked: {
    type: Boolean,
    default: false
  },
  lockExpires: {
    type: Date
  },
  active: {
    type: Boolean
    // default: false
  },
  verificationKey:{
    type:String
  },
  verified:{
    type:Boolean
  }
});

const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;
