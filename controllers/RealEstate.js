
// Create a new property
const jwt = require('jsonwebtoken');
// get_by_search
const BookNow = require('../models/BookNow');

const Property = require('../models/RealEstate');
const geolib = require('geolib');


const get_proprety_with_distance = async (req, res) => {
  try {
    const { longitude, latitude } = req.body;
    console.log(req.body);
    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const bookedProperties = await BookNow.find({
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
      ownerConfirmation: true
    });

    const bookedPropertyIds = bookedProperties.map(booking => booking.propertyId);

    const properties = await Property.find({ _id: { $nin: bookedPropertyIds }, active: true });

    const distanceCalculations = properties.map(async property => {
      const { longitude: propLongitude, latitude: propLatitude, ...rest } = property.toJSON();
      if (!propLongitude || !propLatitude) {
        return { _id: property._id, distance: null, ...rest };
      }
      const distanceInKm = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        propLatitude,
        propLongitude
      );
      return { _id: property._id, distance: distanceInKm.toFixed(2), ...rest };
    });

    const propertiesWithDistance = await Promise.all(distanceCalculations);

    const sortedProperties = propertiesWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json(sortedProperties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = deg => {
  return deg * (Math.PI / 180);
};




const get_by_search = async (req, res) => {
  try {
    const { location, startDate, endDate, category, laundry, carParkGarage, parkOnTheStreet, furnished, rampusRoom, levels, internet, shareBathroom, ownBathroom, pets, withPets,  male, female } = req.body;
    console.log(req.body);

    const query = {
      location: { $regex: new RegExp('^' + location, 'i') },
      startDate: {
        $lte: new Date(endDate).setHours(23, 59, 59, 999),
      },
      endDate: {
        $gte: new Date(startDate).setHours(0, 0, 0, 0),
      },
      category: { $regex: new RegExp('^' + category, 'i') },
      active: true,
    };

    const orConditions = [];
    if (laundry !== undefined) orConditions.push({ laundry });
    if (carParkGarage !== undefined) orConditions.push({ carParkGarage });
    if (parkOnTheStreet !== undefined) orConditions.push({ parkOnTheStreet });
    if (furnished !== undefined) orConditions.push({ furnished });
    if (rampusRoom !== undefined) orConditions.push({ rampusRoom });
    if (levels !== undefined) orConditions.push({ levels });
    if (internet !== undefined) orConditions.push({ internet });
    if (shareBathroom !== undefined) orConditions.push({ shareBathroom });
    if (ownBathroom !== undefined) orConditions.push({ ownBathroom });
    if (pets !== undefined) orConditions.push({ pets });
    if (withPets !== undefined) orConditions.push({ withPets });
    // if (drinking !== undefined) orConditions.push({ drinking });
    if (male !== undefined) orConditions.push({ male });
    if (female !== undefined) orConditions.push({ female });

    if (orConditions.length > 0) {
      query.$or = orConditions;
    }

    const properties = await Property.find(query);

    const filteredProperties = await Promise.all(properties.map(async property => {
      const bookNowEntries = await BookNow.find({
        propertyId: property._id,
        ownerConfirmation: true,
        $or: [
          {
            startDate: { $lte: new Date(endDate).setHours(23, 59, 59, 999) },
            endDate: { $gte: new Date(startDate).setHours(0, 0, 0, 0) },
          },
          {
            startDate: { $lte: new Date(startDate).setHours(0, 0, 0, 0) },
            endDate: { $gte: new Date(endDate).setHours(23, 59, 59, 999) },
          }
        ]
      });

      if (bookNowEntries.length === 0) {
        return property;
      } else {
        return null;
      }
    }));

    const propertiesWithIdAsString = filteredProperties
      .filter(property => property !== null)
      .map(property => {
        const { _id, ...rest } = property.toJSON();
        return { _id: _id.toString(), ...rest };
      });

    console.log(propertiesWithIdAsString);
    res.status(200).json(propertiesWithIdAsString);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const createProperty = async (req, res) => {
  console.log("hi"); // Log "hi" to check if the function is being called

  try {
    const token = req.headers.authorization.split(' ')[1]; // Extract the token from the authorization header
    const decoded = jwt.verify(token, 'youtube'); // Verify the token with the secret
    const userId = decoded.userId.toString(); // Extract userId and convert it to string

    // Add userId to the record
    const property = new Property({ ...req.body, userId }); 
    console.log(req.body);

    await property.save();
    res.status(201).json(property);
  } catch (err) {
    console.log(err); // Log the error for debugging
    res.status(400).json({ message: err.message });
  }
};





// Get all properties where active is equal to true
const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({ active: true });
    const today = new Date();
    const propertiesWithIdAsString = await Promise.all(properties.map(async property => {
      const { _id, ...rest } = property.toJSON();
      const propertyId = _id.toString();
      const reservations = await BookNow.find({
        propertyId,
        startDate: { $lt: today },
        endDate: { $gt: today },
        ownerConfirmation: true
      });
      if (reservations.length === 0 && !reservations.some(reservation => reservation.startDate.getTime() === today.getTime() || reservation.endDate.getTime() === today.getTime())) {
        return { _id: propertyId, ...rest };
      }
      return null;
    }));
    const filteredProperties = propertiesWithIdAsString.filter(property => property !== null);
    res.status(200).json(filteredProperties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};








// Get a single property
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a property
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    Object.assign(property, req.body);
    await property.save();
    res.status(200).json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a property
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    await property.remove();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  get_by_search,
  get_proprety_with_distance
};
