'use strict'
const fs = require('fs')
const core = require('./core')
const consts = require('./consts')
const path = require('path')
const users = require('./users')
const UNCONFIRMED_PATH = path.join(consts.SERVER_PATH, 'unconfirmed.json')

const approve = (request, response, data) => {
    let hash = core.getQueryParams(data).hash
    if (!hash) {
    	core.redirect(response, '/')
    	return
    }
    
    fs.readFile(UNCONFIRMED_PATH, 'utf-8', (err, objects) => {
        if (err) {
            console.log("JSON with user data not found, lol")
            core.sendError(response, err)
            return
        }
        
        let array = JSON.parse(objects)
        let findedUser = array.filter(user => {
            return user.hash === hash
        }).find(user => true)      

        if (findedUser == undefined){
            core.redirect(response, "/auth")
        }
        else{
            array = array.filter(user => user != findedUser)

            fs.writeFile(UNCONFIRMED_PATH, JSON.stringify(array), 'utf8', (err) => {
                if (err) {
                    console.log("JSON with user data not found, lol")
                    core.sendError(response, err)
                    return
                }

                users.addUser(findedUser.email, findedUser.username, findedUser.password)
                	.then(() => {core.redirect(response, "/approvesuccess.html")},
                			(err) => {core.sendError(response, err)})
            })
        }
    })
}

exports.invoke = approve

