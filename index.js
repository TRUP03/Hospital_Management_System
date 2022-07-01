const express=require('express');
const app=express();
const path=require('path');

app.listen(8080,()=>{
    console.log("listenning at port 8080")
})
app.get('/',(req,res)=>{
    // res.send("Finally here...!")
    res.render('home.ejs');
})
app.get('/login',(req,res)=>{
    res.render('login.ejs');
})

app.get('/signin',(req,res)=>{
    res.render('signin.ejs');
})

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));