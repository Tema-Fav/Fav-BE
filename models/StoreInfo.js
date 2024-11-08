const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeInfoSchema = new Schema({
  store_name: { type: String, required: true },
  store_address: { type: String, required: true },
  store_phone: { type: String, required: true },
  boss_name: { type: String, required: true },
  store_photo: { type: String, required: true },
});

const StoreInfo = mongoose.model('StoreInfo', storeInfoSchema);
module.exports = StoreInfo;
