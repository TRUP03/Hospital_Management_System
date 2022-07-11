//jshint esversion:6
require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const path = require('path');
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret:process.env.SECRET,
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
mongoose.connect("mongodb://localhost:27017/login", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    name:"string",
    speciality:"string",
    contactNumber:"number",
    username: "string",
    location: "string",
    state: "string",
    duration: "number",
    zip: "number",
    password: "string"
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/', (req, res) => {
    User.find({},(err,doctor)=>{
        if(err)console.log("error");
        else
        res.render('home.ejs',{doctor:doctor});
    });
   
});
app.get('/login', (req, res) => {
    const user = new User({
    email:req.body.email,
    password:req.body.password
    });
   
    res.render('login.ejs');
});
app.get('/signinPatient', (req, res) => {
    res.render('signinPatient.ejs');
});
app.get('/signinDoc',(req,res)=>{
    res.render('signinDoc.ejs');
});
app.get('/patient',(req,res)=>{
    if(req.isAuthenticated()){
         res.render('patient.ejs');
    }else{
        res.redirect('/login');
    }
   
});
app.get('/doctor',(req,res)=>{
    if(req.isAuthenticated()){
        res.render('doctor.ejs');
   }else{
       res.redirect('/login');
   }
});
app.post('/signinPatient',(req,res)=>{
    User.register({username:req.body.username}, req.body.password, (err,user)=>{
        if(err){
            console.log(err);
            res.redirect('/signinPatient');
        }
        else{
            passport.authenticate('local')(req,res,()=>{
                res.redirect('/patient');
            });
        }
    });
});
app.post('/signinDoc',(req,res)=>{
    User.register({username:req.body.username}, req.body.password, (err,user)=>{
        if(err){
            console.log(err);
            res.redirect('/signinDoc');
        }
        else{
            passport.authenticate('local')(req,res,()=>{
                res.redirect('/doctor');
            });
        }
    });
});
app.post('/admin', (req, res) => {
    const password = req.body.password;
    User.findOne({
        email:"admin@gmail.com"
    }, (err, result) => {
        if (err) {
            console.log(err);
        } else if (result.password === password) {
            res.render('admin.ejs');
        }
    });
});
app.post('/', (req, res) => {
    const name = req.body.name;
    const degree = req.body.degree;
    const specialisation = req.body.specialisation;
    const contact = req.body.contact;

    const doc = new Doctor({
        name:name,
        degree:degree,
        specialisation:specialisation,
        contact:contact
    });
    doc.save();
   res.redirect('/');
});


app.listen(8080, () => {
    console.log("listenning at port 8080");
});