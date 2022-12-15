//jshint esversion:6
require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const mongoose = require('mongoose');
const doctorModel = require('./models/doctor-model');
const patientModel = require('./models/patient-model');
const patientRoutes = require('./routes/patient-routes');
const doctorRoutes = require('./routes/doctor-routes');
const LocalStrategy = require('passport-local');

//uses
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret:"thisissecret",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
// mongoose.connect("mongodb+srv://Truptee:Truptee123@cluster0.u3q7n.mongodb.net/logIns", {
//     useNewUrlParser: true
// });

//mongoose connect
mongoose.connect("mongodb://localhost:27017/login", {useNewUrlParser: true});

//startegy local
passport.use('doctorlocal', new LocalStrategy(doctorModel.authenticate()));
passport.use('patientlocal', new LocalStrategy(patientModel.authenticate()));
//serialiaze
passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    patientModel.findById(id, (err, patient) => {
      if (err) return done(err, null);
      if (patient) return done(null, patient);
      doctorModel.findById(id, (error, doctor) => {
        if (error) return done(error, null);
        if (doctor) return done(null, doctor);
      });
    });
  });


app.get('/',(req,res)=>{
    res.render('landing.ejs');
});

app.get('/aboutUs',(req,res)=>{
  res.render('about.ejs');
});
app.get('/searchDoc', (req, res) => {
  doctorModel.find({},(err,doctor)=>{
        if(err)console.log("error");
        else
        res.render('searchDoc.ejs',{doctor:doctor});
    });
   
});


//using routes
app.use( doctorRoutes);
app.use( patientRoutes);

let port = process.env.PORT;
if(port==null || port=="")
{
  port = 8080;
}
//server listening
app.listen(port, () => {
    console.log("listenning at port 8080");
});