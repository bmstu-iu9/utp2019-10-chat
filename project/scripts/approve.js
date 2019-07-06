'use strict'
const fs = require('fs')
const core = require('./core')
const consts = require('./consts')
const path = require('path')
const users = '/users.json'
const unconfirmed =  '/unconfirmed.json'

const approve = (request, response, data) => {
    let hash = core.getQueryParams(data).hash
    fs.readFile(path.join(consts.SERVER_PATH, unconfirmed), 'utf-8', (err, objects) => {
        if (err) {
            console.log("JSON with user data not found, lol")
            core.sendError(response, err)
        }
        
        let array = JSON.parse(objects)
        let findedUser = array.filter(user => {
            return user.hash === hash
        }).find(user => true)      

        if (findedUser == undefined){
            //<-----------------Тут путь к странице с не успешным подтверждением регистрации ------------------------>
            core.redirect(response, "/failed.html")
        }
        else{
            array = array.filter(user => user != findedUser)

            fs.writeFile(path.join(consts.SERVER_PATH, unconfirmed), JSON.stringify(array), 'utf8', (err) => {
                if (err) {
                    console.log("JSON with user data not found, lol")
                    core.sendError(response, err)
                }
            })
            approveUser(findedUser)
            //<-----------------Тут путь к странице с успешным подтверждением регистрации ------------------------>
            core.redirect(response, "passed.html")
        }
    })
}

const approveUser = (findedUser) => {
    fs.readFile(path.join(consts.SERVER_PATH, users), 'utf-8', (err, objects) => {
        if (err) {
            console.log("JSON with user data not found, lol")
            core.sendError(response, err)
        }
        
        let array = JSON.parse(objects)
        array.push({
            username: findedUser.username,
            email : findedUser.email,
            password : findedUser.password
        })

        fs.writeFile(path.join(consts.SERVER_PATH, users), JSON.stringify(array), 'utf8', (err) => {
            if (err) {
                console.log("JSON with user data not found, lol")
                core.sendError(response, err)
            }
        })
    })
}

exports.invoke = approve

