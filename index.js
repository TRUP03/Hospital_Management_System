//jshint esversion:6
const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Truptee:Truptee123@cluster0.u3q7n.mongodb.net/logIns", {
    useNewUrlParser: true
});
const userSchema = new mongoose.Schema({
    email: "string",
    password: "string"
});
const User = mongoose.model("User", userSchema);
const Admin = new User({
    email: "admin@gmail.com",
    password: "Admin@123"
});
// Admin.save();
const doctorSchema = new mongoose.Schema({
    name:"string",
    degree:"string",
    specialisation:"string",
    contact:"number"
});
const Doctor = mongoose.model("Doctor", doctorSchema);

const doc1 = new Doctor({
    name:"Ravi Singh",
    degree:"MBBS",
    specialisation:"cardiologist",
    contact:"9877667788"
});

// doc1.save();
const navSchema = new mongoose.Schema({
    
});
app.listen(8080, () => {
    console.log("listenning at port 8080");
});
app.get('/', (req, res) => {
    Doctor.find({},(err,doctor)=>{
        if(err)console.log("error");
        else
        res.render('home.ejs',{doctor:doctor});
    });
   
});
app.get('/login', (req, res) => {
    res.render('login.ejs');
});
app.get('/signin', (req, res) => {
    res.render('signin.ejs');
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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));