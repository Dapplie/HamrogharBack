const jwt = require('jsonwebtoken');
const TenantPreferences = require('../models/tenantPreferences');
const User = require('../models/Auth');
const mongoose = require('mongoose');

const get_user_by_id = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'youtube');
        const userId = decodedToken.userId; // Convert userId to ObjectId
        console.log(userId);

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const tenantPreferences = await TenantPreferences.findOne({ tenantId: userId });
        if (!tenantPreferences) {
            return res.status(404).json({ message: "Tenant preferences not found" });
        }

        res.status(200).json({ user, tenantPreferences });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const add_preferences = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'youtube');
        const userId = decodedToken.userId;
    
        const { location, numberOfPeople, facilities, idVerification } = req.body;
    
        // Check if there is an existing record for the user
        let existingPreferences = await TenantPreferences.findOne({ tenantId: userId });
    
        if (existingPreferences) {
          // Update the existing record
          existingPreferences.location = location;
          existingPreferences.numberOfPeople = numberOfPeople;
          existingPreferences.facilities = facilities;
          existingPreferences.idVerification = idVerification;
          await existingPreferences.save();
        } else {
          // Create a new record if no existing record is found
          const newPreferences = new TenantPreferences({
            tenantId: userId,
            location,
            numberOfPeople,
            facilities,
            idVerification
          });
          await newPreferences.save();
        }
    
        res.status(201).json({ message: 'Preferences added/updated successfully!' });
      } catch (error) {
        res.status(400).json({ message: 'Error adding/updating preferences', error: error.message });
      }
};





const get_preferences = async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'youtube');
      const userId = decodedToken.userId;
  
      const preferences = await TenantPreferences.find({ tenantId: userId });
  
      res.status(200).json(preferences);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching preferences', error: error.message });
    }
  };
module.exports = { add_preferences, get_preferences,get_user_by_id };
