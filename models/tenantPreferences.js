const mongoose = require('mongoose');

const TenantPreferencesSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  numberOfPeople: {
    type: Number,
    required: true
  },
  facilities: {
    type: [String],
    required: true
  },
  idVerification: {
    type: Boolean,
    required: true
  }
});

const TenantPreferences = mongoose.model('TenantPreferences', TenantPreferencesSchema);

module.exports = TenantPreferences;
