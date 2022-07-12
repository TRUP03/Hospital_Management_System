//jshint esversion:6
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const patientSchema = new mongoose.Schema({
    name:"string",   
    contactNumber:"number",
    username: "string",
    location: "string",
    zip: "number",
    password: "string"
});

patientSchema.plugin(passportLocalMongoose);
const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;