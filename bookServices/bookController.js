const fs = require("fs")
const dataPath = './ManagementData/books.json'
const data = fs.readFileSync('./ManagementData/books.json')


module.exports = {
    getBooksList: (req, res) => {
        fs.readFile('./ManagementData/books.json', 'utf8', function(err, data) {

            if (err) {
                return console.error(err);
            }
            data = JSON.parse(data, null, 2);
            res.end(JSON.stringify(data));
        })
    },

    addNewBook: (req, res) => {
        const book = {
            "id": req.body.id,
            "title": req.body.title,
            "Description": req.body.Description,
            "Author": req.body.Author
        }
        const rawdata = fs.readFileSync('./ManagementData/books.json')
        const jsonData = JSON.parse(rawdata)
        jsonData.push(book)
        const data = JSON.stringify(jsonData, null, 2)
        fs.writeFileSync('./ManagementData/books.json', data, (err, res) => {
            if (err)
                throw err;
            console.log("Record inserted Successfully");

        });
        res.send(JSON.parse(data));
    },

    updateRecord: (req, res) => {
        //console.log(req.body)
        const bookId = req.body['id']
        console.log("id", bookId)
        const rawdata = fs.readFileSync('./ManagementData/books.json')
        const jsonData = JSON.parse(rawdata)

        const data = JSON.stringify(jsonData, null, 2)
            //console.log("type ", typeof data)
        var found = jsonData.findIndex(obj => obj.id === bookId)

        if (!found) {

            return res.send("Check ID")
        }
        let update = {
            id: req.body.id,
            Title: req.body.Title,
            Description: req.body.Description,
            Author: req.body.Author
        }
        jsonData.splice(found, 1, update)
        const newdata = JSON.stringify(jsonData, null, 2)
        fs.writeFileSync('./ManagementData/books.json', newdata, (err, res) => {
            if (err)
                throw (err.name, err.message);
            res.status(201)
        });
        res.send(JSON.parse(newdata))

    },

    deleteBookRecord: (req, res) => {
        const bookId = req.body['id']
        const rawdata = fs.readFileSync('./ManagementData/books.json')
        const jsonData = JSON.parse(rawdata)
        const filteredDataIndex = jsonData.map(function(b) { return b.id; }).indexOf(bookId);
        jsonData.splice(filteredDataIndex, 1)
        const data = JSON.stringify(jsonData, null, 2)
        fs.writeFileSync('./ManagementData/books.json', data, (err, res) => {
            if (err)
                throw err;
            console.log("Record inserted Successfully");
        });
        res.send(JSON.parse(data));
    }

}