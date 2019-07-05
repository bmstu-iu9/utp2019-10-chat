const fs = require('fs');
const core = require('./core');
const consts = require('./consts')

const reg = (request, response, data) => {
    const args = core.getQueryParams(data);
    fs.readFile(consts.SERVER_PATH + '/users.json', 'utf-8', (err, data) => {
        if (err) {
            console.log("JSON with user data not found, lol");
            throw err;
        }
        var array = JSON.parse(data);
        array.push(args);
        fs.writeFile(consts.SERVER_PATH + '/users.json', JSON.stringify(array), 'utf8', (err) => {
            if (err) {
                console.log("JSON with user data not found, lol");
                throw err;
            }
        })
    });
}

exports.invoke = reg;