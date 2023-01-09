const express = require('express');
const router = express.Router();
const Uni = require('../Models/Universitie');
const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);
// const user = require('../Models/UserSchema');
require('../DB/Conn');
var nodemailer = require('nodemailer');
const requests = require('../Models/ModuleRequests');
const Events = require('../Models/Events');

router.get('/getTitles', async (req, res) => {
  const result = await Uni.find({});
  if (result) {
    res.send({ data: result });
    // res.status(201).json({ message: 'user registred successfully' });
  }
  // let title = 'Hello';
  // const Universitie = new Universities({ title });
  // await Universitie.save();
  // res.status(201).json({ message: 'user registred successfully' });
});

router.get('/getDiscipline', async (req, res) => {
  const result = await Uni.find({}, { discipline: 1 });

  if (result) {
    res.send({ data: result });
  }
});

router.post('/fetchUniversities', async (req, res) => {
  console.log(req.body);
  const {
    merit,
    maximumFees,
    minimumFees,
    discipline,
    city,
    ranking,
    admissionStaus,
    status,
  } = req.body;
  let params = {};
  if (req.body.merit) {
    params = {
      ...params,
      merit: { $lt: req.body.merit },
    };
  }
  if (req.body.maximum || req.body.minimum) {
    params = {
      ...params,
      fee: { $lt: req.body.maximum, $gt: req.body.minimum },
    };
  }
  if (req.body.discipline) {
    params = {
      ...params,
      discipline: req.body.discipline,
    };
  }
  if (req.body.city) {
    params = {
      ...params,
      city: req.body.city,
    };
  }
  if (req.body.admissionStatus === 'open') {
    params = {
      ...params,
      admissions: 0,
    };
  }
  if (req.body.admissionStatus === 'closed') {
    params = {
      ...params,
      admission: 1,
    };
  }
  if (req.body.ranking) {
    params = {
      ...params,
      ranking: { $lt: req.body.ranking },
    };
  }
  if (req.body.status === 'public') {
    params = {
      ...params,
      status: 1,
    };
  }
  if (req.body.status === 'private') {
    params = {
      ...params,
      status: 0,
    };
  }
  console.log(params);
  const result = await Uni.find(params);
  console.log(result);
  res.send({ data: result });
});

router.post('/modulePayment', async (req, res) => {
  const { id, email, password, uniName, username } = req.body;
  const ActualAmount = 1500;
  const amount = ActualAmount * 100;

  let Descrip = `You have registered for campus finder University Module to manage Your university Data here are the credentials for it 
  email: ${email} \n password:${password} `;
  const results = await requests.findOne({ email: email });
  const uniNames = await requests.findOne({ uniName: uniName });

  if (results || uniNames) {
    res.json({ message: 'already registered', status: 400 });
  } else {
    try {
      const payment = await stripe.paymentIntents.create({
        amount,
        currency: 'pkr',
        description: email,
        payment_method: id,
        confirm: true,
      });
    } catch (error) {
      console.log('Error', error);
    }

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gujjarahsan87@gmail.com',
        pass: 'dzfuxataqwzxuvlb',
      },
    });
    var mailOptions = {
      from: 'gujjarahsan87@gmail.com',
      to: `${email}`,
      subject: 'Confirmation Email',
      text: `${Descrip}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    let update = {
      uniName,
      username,
      email,
      password,
      username,
      paymentStatus: 'unpaid',
    };

    const result = new requests(update);
    await result.save();
    res.json({ message: 'successfully registered', status: 200 });
  }
});

router.get('/getEvents', async (req, res) => {
  const result = await Events.find();
  if (result) {
    res.json({
      message: 'events fetched successfully',
      data: result,
      status: 200,
    });
  }
});

router.get('/top10', async (req, res) => {
  let params = {
    ranking: { $lt: 100 },
  };

  const result = await Uni.find({ ranking: { $lt: 10 } });
  console.log(result);
  if (result) {
    res.json({ data: result });
  }
});

module.exports = router;
