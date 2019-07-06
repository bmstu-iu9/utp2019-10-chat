'use strict'
const fs = require('fs')
const core = require('./core')
const consts = require('./consts')
const path = require('path')
const crypto = require('crypto')
const users = '/users.json'
const unconfirmed =  '/unconfirmed.json'
const nodemailer = require('nodemailer')
            
const reg = (request, response, data) => {
    const args = core.getQueryParams(data)
    fs.readFile(path.join(consts.SERVER_PATH, users), 'utf-8', (err, data) => {
        if (err) {
            console.log("JSON with user data not found, lol")
            core.sendError(response, err)
        }

        let array = JSON.parse(data)
        if (array.filter(user => {
            return user.email == args.email
        }).length !== 0){
            //<-----------------Тут путь к странице с не успешной регистрацией ------------------------>
            core.redirect(response, "/failed.html")
        }
        else {
            args.hash = crypto.randomBytes(256).toString('hex')
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'QuickChatIU9@gmail.com',
                    pass: 'BkwUJgLjEP8y2N2'
                }
            });

            let mailOptions = {
                from: 'QuickChatIU9@gmail.com',
                to: args.email,
                subject: 'QuickChat registration!',
                text: 'Please follow the link below \n\n'+"http://"+ consts.SERVER_IP+"/approve.js?hash="+args.hash
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    //<-----------------Тут путь к странице с не успешной регистрацией ------------------------>
                    core.redirect(response, "/failed.html")
                } else {
                    addUserInUnconfirmed(response,args)        
                    //<----------------Тут путь к странице успешной регистрации----------------------->
                    core.redirect(response, "/passed.html")
                }
            });
        }
    })
}

const addUserInUnconfirmed = (response,args) => {
    fs.readFile(path.join(consts.SERVER_PATH, unconfirmed), 'utf-8', (err, objects) => {
        if (err) {
            console.log("JSON with user data not found, lol")
            core.sendError(response, err)
        }

        let newConfirmed = JSON.parse(objects)
        newConfirmed = newConfirmed.filter(user => { return user.email !== args.email})
        newConfirmed.push(args)
        fs.writeFile(path.join(consts.SERVER_PATH, unconfirmed ), JSON.stringify(newConfirmed), 'utf-8', (err) => {
            if (err) {
                console.log("JSON with user data not found, lol")
                core.sendError(response, err)
            }
        })

    })
} 

exports.invoke = reg
