const express=require('express');
const mysql=require('mysql');
const dotenv=require('dotenv');

const path = require('path');
const cookieParser=require('cookie-parser');
dotenv.config({path:'./.env'});

// const profileRoutes = require('/profile');
// app.use('/profile', profileRoutes);

const app=express();
const port=5000;

const db=mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE
})

const publicDirectory=path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use(express.static(publicDirectory));

app.set('view engine','hbs');

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());

db.connect((error)=>{
    if (error){
        console.log(error)
    }
    else{
        console.log('Mysql Connected...');
    }
});

app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));   

app.listen(port,() =>{
    console.log(`server started on port ${port}`)
    })