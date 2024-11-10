const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dashboardSchema = new Schema({
  follow_num: { type: Number, required: true },
  boss_id: { type: Schema.Types.ObjectId, ref: 'boss', required: true },
});

const Dashboard = mongoose.model('Dashboard', dashboardSchema);
module.exports = Dashboard;
