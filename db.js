const mongoose = require('mongoose');
const MONGO_HOST =
  'mongodb+srv://admin:admin1234@cluster0.befuh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose
  .connect(MONGO_HOST, {
    retryWrites: true,
    w: 'majority',
  })
  .then((db) => {
    console.log('db connected');
    // console.log(db);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose;
