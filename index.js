require("dotenv").config();
const { request } = require("express");
const express = require('express')
const Joi = require("joi");

const bodyParser = require('body-parser');
const fs = require("fs")
const bookRouter = require('./bookServices/bookRouter')
const userRouter = require('./userServices/userRouter')

const app = express()

app.use(express.json());



app.get('/', (req, resp) => {
    resp.send('Welcome to Library Management System')
})

app.get('/bookData', function(req, res) {
    fs.readFile('./ManagementData/books.json', 'utf8', function(err, data) {
        if (err) {
            return console.error(err);
        }
        data = JSON.parse(data, null, 2);
        res.end(JSON.stringify(data));
    })
})

app.get('/userData', function(req, res) {
    fs.readFile('./ManagementData/user.json', 'utf8', function(err, data) {
        if (err) {
            return console.error(err);
        }
        data = JSON.parse(data);
        res.end(JSON.stringify(data));
    })
})

//signup api for user login details 
app.post('/sign_up', function(req, res) {
    const user = {
        "name": req.body.name,
        "email": req.body.email,
        "gender": req.body.gender,
        "phone_no": req.body.phone_no,
        "address": req.body.address,
        "DOB": req.body.DOB,
        "user_type": req.body.user_type,
        "password": req.body.password
    }
    const rawdata = fs.readFileSync('./ManagementData/user.json')
    const jsonData = JSON.parse(rawdata)
    jsonData.push(user)
    const data = JSON.stringify(jsonData, null, 2)
    fs.writeFileSync('./ManagementData/user.json', data, (err, res) => {
        console.log("hello")
        if (err)
            throw err;
        console.log("Record inserted Successfully");

    });
    res.send(JSON.parse(data));
})


app.use("/bookRouter", bookRouter)
app.use("/user", userRouter)




process.on('uncaughtException', function(err) {
    console.log(err.name, err.message);
})

app.listen(process.env.APP_PORT, () => {
    console.log("server up and running on PORT:", process.env.APP_PORT);
});