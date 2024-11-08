const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dashboardSchema = new Schema({
  name: { type: String, required: true },
  follow_num: { type: Number, required: true },
});

const Dashboard = mongoose.model('Dashboard', dashboardSchema);
module.exports = Dashboard;
