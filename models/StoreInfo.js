const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Boss = require('../models/Boss');

const storeInfoSchema = new Schema(
  {
    boss_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Boss',
      required: true,
    },
    store_name: { type: String, required: true },
    store_address: { type: String, required: true },
    store_info: { type: String, required: true },
    store_photo: { type: String, required: true },
    store_photo: { type: String, required: false }, // 필수 여부 제거
    boss_id: { type: Schema.Types.ObjectId, ref: 'boss', required: true },
  },
  {
    toJSON: true,
    toObject: true,
  },
);

storeInfoSchema.virtual('boss', {
  ref: 'Boss',
  localField: 'boss_id',
  foreignField: '_id',
  justOne: true,
});

const StoreInfo = mongoose.model('StoreInfo', storeInfoSchema);
module.exports = StoreInfo;
