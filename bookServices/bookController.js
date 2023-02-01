// const fs = require("fs")
// const dataPath = './ManagementData/books.json'
// const data = fs.readFileSync('./ManagementData/books.json')
// const redis = require('redis')
// const client = redis.createClient()
const { Model } = require("mongoose");
//const book = require("./Book")
const Book = require('./Book')

const addNewBook = async(req, res) => {
    const book = new Book({
        Title: req.body.Title,
        Description: req.body.Description,
        Author: req.body.Author
    })
    try {
        const newBook = await book.save()
        res.status(200).json(newBook)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const redis_book = (req, res, next) => {
    client.get('BookList', (err, redis_data) => {
        if (err) {
            throw err
        } else if (redis_data) {
            res.send(JSON.parse(redis_data))
        } else {
            next()
        }
    })
}

const getBooksList = async(req, res) => {
    try {
        const books = await Book.find()
        res.json(books)
        console.log("inside find router")
        client.setEx('BookList', 3600, JSON.stringify(books))
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const deleteBook = async(req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const data = await Book.findByIdAndDelete(id);
        res.send(` deleted..`)
        console.log("data found")
    } catch (error) {
        res.status(400).json({ message: error.message })
        console.log("not data found")
    }
}

module.exports = {
    addNewBook,
    getBooksList,
    deleteBook,
    redis_book
}