const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeInfoSchema = new Schema({
  store_name: { type: String, required: true },
  store_address: { type: String, required: true },
  store_info: { type: String, required: true },
  store_photo: { type: String, required: true },
  boss_id: { type: Schema.Types.ObjectId, ref: 'boss', required: true },
});

const StoreInfo = mongoose.model('StoreInfo', storeInfoSchema);
module.exports = StoreInfo;
