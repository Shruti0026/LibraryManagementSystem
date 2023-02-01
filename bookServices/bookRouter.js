const { addNewBook, getBooksList, deleteBook, redis_book } = require('./bookController')
    //const fs = require("fs")
const express = require("express");
const app = express.Router();
const Book = require('./Book')

/**
 * @swagger
 *  components:
 *    schemas:
 *      Books:
 *        type: object
 *        properties:
 *          Title:
 *            type: string
 *            description: enter book title
 *          Description:
 *            type: string
 *            description: enter book description
 *          Author:
 *            type: string
 *            description: enter author name
 */


/**
 * @swagger
 * /get:
 *  get:
 *      summary: this api is to check if get method is working
 *      description: this api is to check if get method is working
 *      responses: 
 *          200:
 *              description: to test get method
 */
app.get("/get", (req, res) => {
    console.log("inside router")
    res.send("welcome to Library Management System")
})


/**
 * @swagger
 * /book/getBooksList:
 *  get:
 *    tags:
 *      - Books
 *    summary: Retrieve a list of books
 *    description: Retrieve a list of books from mongodb
 *    responses:
 *      200:
 *        description: A list of books.
 *        content: 
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                description:
 *                  type: string
 *                  example: Successfully fetched all data!
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Books'
 */
app.get("/getBooksList", redis_book, getBooksList);

/**
 * @swagger
 * /book/addNewBook:
 *    post:
 *      tags:
 *        - Books
 *      description: Add new Book
 *      summary: Create book data
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               Title:
 *                  type: string
 *                  description: enter book title
 *               Description:
 *                  type: string
 *                  description: enter book description
 *               Author:
 *                  type: string
 *                  description: enter author name
 *      responses:
 *        200:
 *          description: Successfully created data
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  description:
 *                    type: string
 *                    example: Successfully created data! 
 */
app.post("/addNewBook", addNewBook)


/**
 * @swagger
 * /book/delete/{id}:
 *    delete:
 *      tags:
 *        - Books
 *      summary: Remove book data by id
 *      description: Remove book API  
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: Books id
 *      responses:
 *        200:
 *          description: Successfully deleted data
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  description:
 *                    type: string
 *                    example: Successfully updated data!     
 */
app.delete("/delete/:id", deleteBook)


module.exports = app;