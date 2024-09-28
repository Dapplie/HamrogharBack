const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  image: {
    type: String,
    
  },
  imageArray: {
    type: [String],
    default: ['']
  },
  video: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  rent: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ownerHouseRules: {
    type: String,
    required: true
  },
  students: {
    type: Boolean,
    default: false
  },
  jobHolder: {
    type: Boolean,
    default: false
  },
  pets: {
    type: Boolean,
    default: false
  },
  male: {
    type: Boolean,
    default: false
  },
  female: {
    type: Boolean,
    default: false
  },
  withPets: {
    type: Boolean,
    default: false
  },
  // drinking: {
  //   type: Boolean,
  //   default: false
  // },
  water: {
    type: Boolean,
    default: false
  },
  kitchen: {
    type: Boolean,
    default: false
  },
  electricity: {
    type: Boolean,
    default: false
  },
  airconditioner: {
    type: Boolean,
    default: false
  },
  // drinking: {
  //   type: Boolean,
  //   default: false
  // },
  heater: {
    type: Boolean,
    default: false
  },
  publictransportation: {
    type: Boolean,
    default: false
  },
  roadaccess: {
    type: Boolean,
    default: false
  },
  // mn honnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
  category: {
    type: String,
    required: true
  },
  minimumStage:{
    type:String,
    required:true
  },
  // facilities
  floorNumber:{
    type:Number,
    required:true
  },
  // sharedOwnBathroom:{
  //   type:Boolean,
  //   required:true
  // },
  // additional bills
  electricityBills:{
    type:Boolean,
    required:true
  },
  waterBills:{
    type:Boolean,
    required:true
  },
  garbageBills:{
    type:Boolean,
    required:true
  },
  UnitBills:{
    type:Boolean,
    required:true
  },
  // preferences
  family:{
    type:Boolean,
    required:true
  },
  // active
  active:{
    type:Boolean,
    default: false
  },
  startDate:{
    type:Date,
    required:true
  },
  endDate:{
    type:Date,
required:true
  },
  // Finalllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll
  laundry:{
    type:Boolean,
    default: false
  },
  carParkGarage:{
    type:Boolean,
    default: false
  },
  parkOnTheStreet:{
    type:Boolean,
    default: false
  },
  furnished:{
    type:Boolean,
    default: false
  },
  numOfBedrooms:{
    type:Number
  },
  numOfBathroom:{
    type:Number
  },
  // fo2222222222222222222222222222222222
  
  rampusRoom:{
    type:Boolean
  },
  levels:{
    type:Boolean
  },
  // l
  internet:{
    type:Boolean
  },
  shareBathroom:{
    type:Boolean
  },
  ownBathroom:{
    type:Boolean
  },
  numOfBeds:{
    type:Number
  },
  sizeByMetersWidth:{
    type:Number
  },
  sizeByMeterLong:{
    type:Number
  },
  longitude:{
    type:Number
  },
  latitude:{
    type:Number
  },
  heat:{
    type:Boolean
  },

});

const Property = mongoose.model('Property', PropertySchema);

module.exports = Property;
