const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    Title: {
        type: String,
        require: true
    },
    Description: {
        type: String
    },
    Author: {
        type: String,
        require: true
    }
});


const Book = mongoose.model("Book", bookSchema);
module.exports = Book;