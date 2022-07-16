//jshint esversion:6
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  date: {
    type: String,
    default: 'none',
  },
  status: {
    type: String,
    default: 'none',
  },
  time: {
    type: Number,
    default: null,
  },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
