const { getBooksList, addNewBook, deleteBookRecord, updateRecord } = require('./bookController')
const fs = require("fs")
const router = require("express").Router();

router.get("/getBooksList", getBooksList)
router.post("/addNewBook", addNewBook)
router.delete("/deleteBook", deleteBookRecord)
router.put("/updateRecord", updateRecord)





module.exports = router;