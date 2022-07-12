//jshint esversion:6
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const patientSchema = new mongoose.Schema({
    name:"string",   
    usename: "string",
    location: "string",
    state:"string",
    zip: "number",
    password: "string"
});

patientSchema.plugin(passportLocalMongoose);
const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;


