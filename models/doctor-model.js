//jshint esversion:6
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const doctorSchema = new mongoose.Schema({
    name:"string",
    userType:"string",
    speciality:"string",
    contactNumber:"number",
    username: "string",
    location: "string",
    duration: "number",
    password: "string"
});

doctorSchema.plugin(passportLocalMongoose);
const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
