const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dashboardSchema = new Schema({
  boss_id: { type: Schema.Types.ObjectId, ref: 'Boss', required: true },
});

const Dashboard = mongoose.model('Dashboard', dashboardSchema);
module.exports = Dashboard;
