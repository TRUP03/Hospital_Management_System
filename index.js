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


app.listen(8080, () => {
    console.log("listenning at port 8080");
});
app.get('/', (req, res) => {
    res.render('home.ejs');
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
        _id: "62c0af4e4a3b1e2f99987a6d"
    }, (err, result) => {
        if (err) {
            console.log(err);
        } else if (result.password === password) {
            res.render('admin.ejs');
        }
    });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));