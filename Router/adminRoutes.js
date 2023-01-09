const express = require('express');
const router = express.Router();
const Uni = require('../Models/Universitie');

const Requests = require('../Models/ModuleRequests');
const event = require('../Models/Events.js');
require('../DB/Conn');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, '../../CampusFinder/campusFrontend/public/Upload/');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post('/addUni', upload.single('logo'), async (req, res) => {
  console.log(req.body);
  const {
    title,
    province,
    deadline,
    degree,
    contact,
    fee,
    discipline,
    info,
    merit,
    ranking,
    status,
    web,
    city,
    admissions,
    address,
  } = req.body;
  let scholarships = JSON.parse(req.body.scholarships);
  if (req.file) {
    const logo = req.file.originalname;
  }
  let update = {
    title,
    province,
    deadline,
    degree,
    contact,
    fee,
    discipline,
    info,
    merit,
    ranking,
    status,
    web,
    city,
    admissions,
    scholarships,
    address,
  };
  if (req.file) {
    update['logo'] = req.file.originalname;
  }
  console.log(update);
  const uniData = new Uni(update);

  await uniData.save();
  res.status(200).json({ message: 'University Added Sucessfully' });
});

router.post('/deleteUni/:id', async (req, res) => {
  const result = await Uni.findOneAndDelete({ _id: req.params.id });

  res.json({ message: 'delete sucesfully', status: 200 });
});

router.get('/getUni/:id', async (req, res) => {
  const id = req.params.id;

  const result = await Uni.findOne({ _id: id });
  if (result) {
    res.json({ data: result });
  }
});

router.post('/EditUni/:id', upload.single('logo'), async (req, res) => {
  const id = req.params.id;
  console.log(req.body);

  const result = await Uni.findOne({ _id: id });

  if (result) {
    result.title = req.body.title;
    result.province = req.body.province;
    result.deadline = req.body.deadline;
    result.degree = req.body.degree;
    result.contact = req.body.contact;
    result.fee = req.body.fee;
    result.discipline = req.body.discipline;
    result.info = req.body.info;
    result.merit = req.body.merit;
    result.ranking = req.body.ranking;
    result.type = req.body.type;
    result.web = req.body.web;
    result.status = req.body.status;
    if (req.file) {
      result.logo = req.file.originalname;
    }
    result.address = req.body.address;

    await result.save();

    res.send({ message: 'University Updated Successfully' });
  }
});
router.post('/addScholarships/:id', async (req, res) => {
  const id = req.params.id;

  const result = await Uni.findOne({ _id: id });

  if (result) {
    result.scholarships = req.body;
    await result.save();
    res.json({ message: 'Scholarships updated Successfully' });
  }
});

router.post('/addEvents', upload.single('logo'), async (req, res) => {
  console.log(req.body);
  const result = event.findOne({ name: req.body.name });
  if (req.file) {
    req.body.logo = req.file.originalname;
  }
  const eventData = new event(req.body);
  await eventData.save();
  res.json({ message: 'events has been added' });
});

router.get('/getEvents', async (req, res) => {
  const result = await event.find();
  res.json({ data: result });
});

router.get('/getEvent/:id', async (req, res) => {
  const id = req.params.id;
  const result = await event.find({ _id: id });
  res.json({ data: result });
});

router.post('/editEvents/:id', upload.single('logo'), async (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  const logo = req.file.originalname;
  const result = await event.findOne({ _id: id });
  if (result) {
    result.name = req.body.name;
    result.description = req.body.description;
    result.endData = req.body.endDate;
    result.link = req.body.link;
    result.logo = logo;
    result.organizer = req.body.organizer;
    result.startDate = req.body.startDate;
    result.address = req.body.address;

    await result.save();
    res.json({ message: 'event has been updated' });
  }
});

router.post('/deleteEvent/:id', async (req, res) => {
  const id = req.params.id;
  const result = await event.deleteOne({ _id: id });
  res.json({ message: 'event has been deleted' });
});

router.get('/TotalUniversity', async (req, res) => {
  const uniTotal = await Uni.find();
  const eventTotal = await event.find();
  res.send({ event: eventTotal, uni: uniTotal });
});

router.get('/getModuleRequests', async (req, res) => {
  const result = await Requests.find({});
  if (result) {
    res.json({
      message: 'module has been fetched',
      data: result,
      status: 200,
    });
  }
});

router.post('/approveStatus', async (req, res) => {
  console.log(req.body);
  const result = await Requests.findOne({ _id: req.body.id });

  if (req.body.type === 'approve') {
    if (result) {
      result.status = 'Approved';
      result.paymentStatus = 'paid';
      await result.save();
    }
  }
  if (req.body.type === 'disapprove') {
    if (result) {
      result.status = 'Disapproved';
      result.paymentStatus = 'unpaid';
      await result.save();
    }
  }
  res.json({
    message: 'status has been updated',
  });
});

router.get('/requestStats', async (req, res) => {
  const result = await Requests.find({});
  const disapprove = await Requests.find({ status: '' });
  res.json({
    total: result.length,
    pending: disapprove.length,
  });
});

router.get('/getProvince', async (req, res) => {
  const result = await Uni.find({}, { province: 1 });

  if (result) {
    res.send({ data: result });
  }
});
module.exports = router;
