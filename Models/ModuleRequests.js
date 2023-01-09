const mongoose = require('mongoose');

var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ModuleRequests = new mongoose.Schema({
  uniName: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  paymentStatus: {
    type: String,
  },
  status: {
    type: String,
  },
  Events: [
    {
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
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

ModuleRequests.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

const Requests = mongoose.model('ModuleRequests', ModuleRequests);

module.exports = Requests;
