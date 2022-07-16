//jshint esversion:6
const express = require('express');
const passport = require('passport');
const doctorModel = require('../models/doctor-model');
const router = express.Router({ mergeParams: true });

router.get('/loginDoc', (req, res) => {
    res.render('loginDoc.ejs');
});

router.post("/loginDoc", (req, res) => {
    const email = req.body.email;
    doctorModel.findOne({ username: email }, function (err, u) {
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
                      res.redirect("/doctor");
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

  router.post('/signinDoc',(req,res)=>{
    const doctor = new doctorModel({
      name:req.body.name,
      usertype:"doctor",
      speciality:req.body.speciality,
      contactNumber:req.body.contactNumber,
      username:req.body.username,
      location: req.body.location,
      duration: req.body.duration,
    });
    doctorModel.register(doctor, req.body.password, (err,user)=>{
          if(err){
              console.log(err);
            const data = {};
            data.user = req.user;
            console.log(user);
            res.render('signinDoc',{data});
          }
          else{
              passport.authenticate('local')(req,res,()=>{
                  res.redirect('/doctor');
              });
          }
      });
  });

  router.get('/doctor',(req,res)=>{
    if(req.isAuthenticated()){
      const data ={};
      data.user = req.user;
        res.render('doctor',{data});
    }else{
        res.redirect('/loginDoc');
    }
});

router.get('/signinDoc',(req,res)=>{
    res.render('signinDoc.ejs');
});
module.exports = router;

