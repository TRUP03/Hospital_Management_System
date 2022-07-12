//jshint esversion:6
const express = require('express');
const passport = require('passport');
const patientModel = require('../models/patient-model');
const router = express.Router({ mergeParams: true });

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
module.exports = router;