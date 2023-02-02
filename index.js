require("dotenv").config();
const bookRouter = require('./bookServices/bookRouter')
const { request } = require("express");
const express = require('express')
const PORT = process.env.PORT || 3004;
const fs = require("fs")
const app = express()
const { genSaltSync, hashSync, compareSync } = require("bcrypt")
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express');
const redis = require("redis");
const client = redis.createClient({
    host: 'redis',
    legacyMode: true,
    port: 6379
});

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client connected'));

app.use(express.json());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: 'Library Management API',
            description: "Library Management API System",
            version: "1.0.0"
        },
        servers: [{
            url: "http://localhost:3004"
        }]
    },
    apis: ['./bookServices/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


/**
 * @swagger
 * /book:
 *  get:
 *      summary: this api is to check if get method is working
 *      description: this api is to check if get method is working
 *      responses: 
 *          200:
 *              description: to test get method
 */

app.get('/book', (req, res) => {

    res.send('Welcome to Library Management System')
    console.log("inside book api")
})

const products = [
    { productName: 'Laptop', price: 27 },
    { productName: 'Charger', price: 32 },
    { productName: 'mobile phone', price: 45 }
]

app.get('/productList', async(req, res) => {
    try {
        client.get('product', async(err, product) => {
            if (err) {
                console.error(err);
                throw err;
            }
            if (product != null) {
                console.log('products retrieved from Redis');
                res.status(200).send(JSON.parse(product));
            } else {
                // const product = await products.find()
                res.json(products)
                client.setex('product', 600, JSON.stringify(products));
                console.log('products retrieved from the API');
            }
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})


const DEFAULT_EXPIRATION = 3600
app.get('/bookData', function(req, res) {
    client.get("bookData", async(error, bookData) => {
        if (error) console.error(error)
        if (bookData != null) {
            console.log("cache hit")
            return res.json(JSON.parse(bookData))
        } else {
            fs.readFile('./ManagementData/books.json', 'utf8', function(err, data) {
                if (err) {
                    return console.error(err);
                }
                data = JSON.parse(data, null, 2);
                res.end(JSON.stringify(data));
                client.setex("bookData", DEFAULT_EXPIRATION, JSON.stringify(data))
            })
        }
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



app.post('/sign_up', function(req, res) {
    const salt = genSaltSync(10)
    const user = {
        "name": req.body.name,
        "email": req.body.email,
        "gender": req.body.gender,
        "phone_no": req.body.phone_no,
        "address": req.body.address,
        "DOB": req.body.DOB,
        "user_type": req.body.user_type,
        "password": hashSync(req.body.password, salt)
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


app.use("/book", bookRouter)


process.on('uncaughtException', function(err) {
    console.log(err.name, err.message);
})

const mongoose = require('mongoose');
const { error } = require("console");

const DB_URI = 'mongodb://mongo:27017/ManagementData';

mongoose.set("strictQuery", true);
mongoose
    .connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected! to port: ", +PORT);
        app.listen(PORT)
    })
    .catch((err) => {
        console.log("oh no error");
        console.log(err.name);
    });