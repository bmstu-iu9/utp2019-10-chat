'use strict'
const fs = require('fs')
const core = require('./core')
const consts = require('./consts')
const path = require('path')
const crypto = require('crypto')
const users = require('./users')
const UNCONFIRMED_PATH = path.join(consts.SERVER_PATH, 'unconfirmed.json')
const nodemailer = require('nodemailer')
            
const reg = (request, response, data) => {
	const curUser = users.getCurrentUser(request)
	if (curUser) {
		core.redirect(response, '/')
		return
	}
	
    const args = core.getQueryParams(data)
    if (!args.email || !args.password || !args.username) {
		core.redirect(response, '/auth')
		return
	}
    
    	if (users.getUser(args.email)) {
            core.redirect(response, "/auth")
        } else {
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

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    core.redirect(response, "/auth")
                } else {
                    addUserInUnconfirmed(response,args)
                    	.then(() => {core.redirect(response, "/regsuccess.html")},
                    			(err) => {core.sendError(err)})
                }
            });
        }
}

const addUserInUnconfirmed = (response,args) => {
	return new Promise((resolve, reject) => {
	    fs.readFile(UNCONFIRMED_PATH, 'utf-8', (err, objects) => {
	        if (err) {
	            console.log("JSON with user data not found, lol")
	            reject(err)
	            return
	        }
	
	        let newConfirmed = JSON.parse(objects)
	        newConfirmed = newConfirmed.filter(user => { return user.email !== args.email})
	        newConfirmed.push(args)
	        fs.writeFile(UNCONFIRMED_PATH, JSON.stringify(newConfirmed), 'utf-8', (err) => {
	            if (err) {
	                console.log("JSON with user data not found, lol")
	                reject(err)
	            } else
	            	resolve()
	        })
	
	    })
	})
} 

exports.invoke = reg