const mongoose = require('mongoose');

var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Events = new mongoose.Schema({
  name: {
    type: String,
  },
  Description: {
    type: String,
  },
  organizer: {
    type: String,
  },
  description: {
    type: String,
  },
  link: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  address: {
    type: String,
  },
  logo: {
    type: String,
  },
});

const event = mongoose.model('events', Events);

module.exports = event;
