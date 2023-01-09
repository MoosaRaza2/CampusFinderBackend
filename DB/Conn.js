const mongoose = require('mongoose');
const DB = 'mongodb://localhost:27017/CampusFinder';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('connection successfull');
  })
  .catch((err) => {
    console.log('no connections');
  });
