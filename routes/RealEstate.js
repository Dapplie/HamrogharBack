const express = require('express');
const real_estate = express.Router();
const { createProperty, getProperties, getPropertyById, updateProperty, deleteProperty, get_by_search, get_proprety_with_distance } = require('../controllers/RealEstate');
const { OwnerAuthenticated } = require('../middlewares/auth');

real_estate.post('/add', OwnerAuthenticated, createProperty);
real_estate.get('/get_all', getProperties);
// get_proprety_with_distance
real_estate.post('/get_proprety_with_distance', get_proprety_with_distance);

// new
real_estate.post('/get_by_search', get_by_search);

// real_estate.get('/:id', getPropertyById);
// real_estate.put('/:id', updateProperty);
// real_estate.delete('/:id', deleteProperty);

module.exports = real_estate;
