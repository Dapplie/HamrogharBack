const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/Auth');
const Role = require('../models/Role');
const mongoose = require('mongoose');
const Property = require('../models/RealEstate');
const owner_delete_properties = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ error: 'Property ID is required' });
    }

    const property = await Property.findByIdAndDelete(_id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
const owner_profile = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'youtube');
    const userId = decoded.userId;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const owner_properties = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).send({ error: 'Authentication token is required' });
    }

    const decoded = jwt.verify(token, 'youtube');
    console.log('Decoded Token:', decoded); // Log the decoded token
    
    const userId = decoded.userId;

    const properties = await Property.find({ userId: userId, active: true });

    if (properties.length === 0) {
      return res.status(404).send({ error: 'Properties not found' });
    }

    res.send(properties);
  } catch (error) {
    console.error('Error in owner_properties:', error.message);
    res.status(500).send({ error: 'Internal server error' });
  }
};



  // rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
  const owner_update_property = async (req, res) => {
    try {
      const { _id } = req.params;
      const {
        name,
        image,
        imageArray,
        video,
        location,
        rent,
        description,
        ownerHouseRules,
        students,
        jobHolder,
        pets,
        male,
        female,
        withPets,
        // drinking,
        water,
        kitchen,
        electricity,
        airconditioner,
        heater,
        publictransportation,
        roadaccess,
        category,
        minimumStage,
        floorNumber,
        // sharedOwnBathroom,
        electricityBills,
        waterBills,
        garbageBills,
        pUnitBills,
        family,
        active,
        // rrrrrrrrrrrrrrrrrrrrrrrrrr
        laundry,
    carParkGarage,
    parkOnTheStreet,
    furnished,
    numOfBedrooms,
    numOfBathroom,
    rampusRoom,
levels,
numOfBeds,
sizeByMetersWidth,
sizeByMeterLong,
internet,
shareBathroom,
ownBathroom,
heat,
      } = req.body;
  
      const updatedProperty = await Property.findByIdAndUpdate(
        _id,
        {
          name,
          image,
          imageArray,
          video,
          location,
          rent,
          description,
          ownerHouseRules,
          students,
          jobHolder,
          pets,
          male,
          female,
          withPets,
          // drinking,
          water,
          kitchen,
          electricity,
          airconditioner,
          heater,
          publictransportation,
          roadaccess,
          category,
          minimumStage,
          floorNumber,
          
          electricityBills,
          waterBills,
          garbageBills,
          pUnitBills,
          family,
          active,
          // rrrrrrrrrrrrrrrrrrrrrrr
          laundry,
    carParkGarage,
    parkOnTheStreet,
    furnished,
    numOfBedrooms,
    numOfBathroom,
    rampusRoom,
levels,
numOfBeds,
sizeByMetersWidth,
sizeByMeterLong,
internet,
shareBathroom,
ownBathroom,
heat,
        },
        { new: true }
      );
  
      res.json(updatedProperty);
    } catch (err) {
      res.status(400).json({ message: err.message });s
    }
  };
  

module.exports = { owner_profile, owner_properties, owner_update_property, owner_delete_properties };
