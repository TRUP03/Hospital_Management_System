//jshint esversion:6
const express = require('express');
const passport = require('passport');
const patientModel = require('../models/patient-model');
const doctorModel = require('../models/doctor-model');
const router = express.Router({ mergeParams: true });
const Appointment = require('../models/appointment-model');

router.post("/loginPatient", (req, res) => {
    const email = req.body.email;
    patientModel.findOne({ username: email }, function (err, u) {
      if (err) {
        console.log(err);
      } else {
        if (u) {
          u.authenticate(req.body.password, (err, model, info) => {
            if (info) {
              res.send("Wrong email or password!");
            }
            if (err) {
              console.log(err);
            } else if (model) {
              req.login(u, (err) => {
                if (err) {
                  console.log(err);
                } else {
                  passport.authenticate("local");
                  req.session.save((error) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.redirect("/patient");
                    }
                  });
                }
              });
            }
          });
        } else {
          res.send("Wrong email or password!");
        }
      }
    });
  });
  router.post('/signinPatient',(req,res)=>{
    const patient = new patientModel({
      name:req.body.name,   
      userType:"patient",
      username:req.body.username,
      location:req.body.location,
      state:req.body.state,
      zip:req.body.zip,
    });
    patientModel.register(patient, req.body.password, (err,user)=>{
          if(err){
              console.log(err);
              res.redirect('/signinPatient');
          }
          else{
              passport.authenticate('patientlocal')(req,res,()=>{
                  res.redirect('/patient');
              });
          }
      });
  });
  router.get('/patient',(req,res)=>{
    if(req.isAuthenticated()){
      const data = {};
      data.user = req.user;
         res.render('patient.ejs',{data});
    }else{
        res.redirect('/login');
    }
   
});
router.get('/signinPatient', (req, res) => {
    res.render('signinPatient.ejs');
});
router.get('/loginPatient', (req, res) => {
    res.render('loginPatient.ejs');
  });

router.get('/searchDoctor/:patientId', (req, res) => {
  const data ={};
  data.user=req.user;
  data.patientId = req.params.patientId;
    doctorModel.find({},(err,found)=>{
      if(err){
        console.log(err);
      }else{
          res.render('doctorSearch.ejs',{doctor:found, data:data});
      }
    });
  
  });

router.get('/searchDoctor/:patientId/:doctorId', (req, res) => {
  const data = {};
   data.user=req.user;
   data.patientId=req.params.patientId;
   data.doctorId=req.params.doctorId;
    res.render('appointment-3.ejs',{data:data});
  });

router.post("/searchDoctor/:patientId/:doctorId",(req,res)=>{
  const data ={};
  data.user = req.user;
  const appointment = new Appointment({
    patientId:req.params.patientId,
    doctorId:req.params.doctorId,
    date:req.body.date,
    time:req.body.time,
    status:"Yet to be confirmed"
  });
  appointment.save();
  res.redirect('/patient').then((alert("Request Sent !!")));

});  
router.get('/logoutPat',(req,res)=>{
  req.logOut((err)=>{
    console.log(err);
  });
  res.redirect('/');
});
module.exports = router;