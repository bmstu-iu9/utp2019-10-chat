'use strict'
const fs = require('fs')
const core = require('./core')
const consts = require('./consts')
const path = require('path')
const crypto = require('crypto')
const users = require('./users')
const UNCONFIRMED_PATH = path.join(consts.SERVER_PATH, 'unconfirmed.json')
const mail = require('./mail')
            
const reg = (request, response, data) => {
	try {
		const args = JSON.parse(data)
	} catch (err) {
		core.sendJSON(response, 400, {'errorMessage': 'JSON corrupted'})
		return
	}
   
    if (users.getUser(args.email)) {
    	core.sendJSON(response, 400, {'errorMessage': 'email already exists'})
    	return
    }
    
    const hash = crypto.randomBytes(256).toString('hex')
    users.addUser(args.email, args.username, args.password)
    	.then(() => {
    		return addUserInUnconfirmed(args.email, hash)
    	}).then(() => {
    		return mail.sendMail(args.email, 'QuickChat registration!',
    		   'Please follow the link below \n\n'+"http://"+request.headers.host+"/approve.js?hash="+hash)
    	}).then(() => {
    		core.sendJSON(response, 201, {'email' : args.email, 'username' : args.username})
    	}).catch((err) => {
    		core.sendJSON(response, 400, {'errorMessage': 'unconfirment adding error', 'error' : err})
    	})
}

const addUserInUnconfirmed = (email, hash) => {
	return new Promise((resolve, reject) => {
	    fs.readFile(UNCONFIRMED_PATH, 'utf-8', (err, objects) => {
	        if (err) {
	            reject(err)
	            return
	        }
	
	        let newConfirmed = JSON.parse(objects)
	        newConfirmed[hash] = email
	        fs.writeFile(UNCONFIRMED_PATH, JSON.stringify(newConfirmed), 'utf-8', (err) => {
	            if (err) {
	                reject(err)
	            } else  
	            	resolve()
	        })
	    })
	})
} 

exports.invoke = reg