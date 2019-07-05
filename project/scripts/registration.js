const fs = require('fs');
const core = require('./core');
const consts = require('./consts');
const path = require('path');

const reg = (request, response, data) => {
    const args = core.getQueryParams(data);
    fs.readFile(path.join(consts.SERVER_PATH, '/users.json'), 'utf-8', (err, data) => {
        if (err) {
            console.log("JSON with user data not found, lol");
            throw err;
        }
        let array = JSON.parse(data);
        if (array.filter(user => {
            return user.email == args.email;
        }).length !== 0){
            core.redirect(response, "/failed.html");
        }
        else {
            array.push(args);
            fs.writeFile(consts.SERVER_PATH + '/users.json', JSON.stringify(array), 'utf8', (err) => {
                if (err) {
                    console.log("JSON with user data not found, lol");
                    throw err;
                }
            })
            core.redirect(response, "/passed.html");
        }
    });
}

exports.invoke = reg;