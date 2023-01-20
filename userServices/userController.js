const fs = require('fs')




module.exports = {
    getUsers: (req, res) => {
        fs.readFile('./ManagementData/user.json', 'utf8', function(err, data) {
            if (err) {
                return console.error(err);
            }
            data = JSON.parse(data, null, 2);
            res.end(JSON.stringify(data));
        })
    },

}