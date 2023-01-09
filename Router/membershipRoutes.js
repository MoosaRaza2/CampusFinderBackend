const express = require('express');
const router = express.Router();
const Uni = require('../Models/Universitie');
const Authenticate = require('../Middleware/Authenticate.js');
const Requests = require('../Models/ModuleRequests');
const event = require('../Models/Events.js');
require('../DB/Conn');
const multer = require('multer');
const jwt = require('jsonwebtoken');

router.post('/validateLogin', async (req, res) => {
  const { email, password } = req.body;
  try {
    let token;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please filled data' });
    }

    const userLogin = await Requests.findOne({ email: email });
    if (userLogin) {
      if (userLogin.password === password && userLogin.status === 'Approved') {
        const accessToken = jwt.sign(
          { id: userLogin._id },
          process.env.SECRET_KEY,
          { expiresIn: '5d' }
        );

        res.status(200).json({ accessToken });
      } else {
        res.status(400).json({ error: 'password doesnt match' });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.post('/addPortalEvents', Authenticate, async (req, res) => {
  console.log(req.rootUser);
  const result = event.findOne({ name: req.body.name });
  if (req.file) {
    req.body.logo = req.file.originalname;
  }
  const eventData = new event(req.body);
  await eventData.save();
});
module.exports = router;
