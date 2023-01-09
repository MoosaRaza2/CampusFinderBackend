const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const University = new mongoose.Schema({
  title: {
    type: String,
  },
  url: {
    type: String,
  },
  type: {
    type: String,
  },
  web: {
    type: String,
  },
  status: {
    type: Number,
  },
  ranking: {
    type: Number,
  },
  province: {
    type: String,
  },
  merit: {
    type: String,
  },
  address: {
    type: String,
  },
  logo: {
    type: String,
  },
  contact: {
    type: String,
  },
  discipline: {
    type: String,
  },
  fee: {
    type: Number,
  },
  info: {
    type: String,
  },
  degree: {
    type: String,
  },
  deadline: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  admissions: {
    type: Number,
  },
  scholarships: {
    scholar: [
      {
        title: String,
        description: String,
      },
    ],
  },
});

const Uni = mongoose.model('Universities', University);

module.exports = Uni;
