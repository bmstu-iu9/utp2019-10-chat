'use strict'
const fs = require('fs')
const core = require('../../scripts/core')
const consts = require('../../scripts/consts')
const path = require('path')
const crypto = require('crypto')
const users = require('../../scripts/users')
const unconfirmed = require('../../scripts/unconfirmed')
const mail = require('../../scripts/mail')
            
exports.invoke = async (request, response, data) => {
	try {
		if (users.getCurrentUser(request)) {
			core.sendJSON(response, {errcode: 'RCODE_AUTHORIZED_ALREADY', errmessage: 'Authorized already'})
			return
		}
		
		let args
		
		try {
			args = JSON.parse(data)
		} catch (err) {
			core.sendJSON(response, {errcode: 'RCODE_JSON_SYNTAX_ERROR', errmessage: 'JSON syntax error'})
			return
		}
		
		if (!args.email || !args.username || !args.password ||
				typeof(args.email) != 'string' || typeof(args.username) != 'string' || typeof(args.password) != 'string') {
			core.sendJSON(response, {errcode: 'RCODE_INCORRECT_ARGUMENTS', errmessage: 'Incorrect arguments'})
			return
		}
			
	    if (await users.getUserLogin(args.email)) {
	    	if (await users.getUserAccept(args.username))
	    		core.sendJSON(response, {errcode: 'RCODE_EMAIL_AND_USERNAME_ALREADY_EXISTS', errmessage: 'Email and username already exists'})
	    	else
	    		core.sendJSON(response, {errcode: 'RCODE_EMAIL_ALREADY_EXISTS', errmessage: 'Email already exists'})
	    	return
	    }
	    
	    if (await users.getUserAccept(args.username)) {
			core.sendJSON(response, {errcode: 'RCODE_USERNAME_ALREADY_EXISTS', errmessage: 'Username already exists'})
			return
	    }
	    
	    const hash = await unconfirmed.addUserInUnconfirmed(args.email, args.username, args.password)
	    
	    try {
	    	await mail.sendMail(args.email, 'QuickChat registration!',
	     		 'Please follow the link below \n\n'+"http://"+request.headers.host+"/approve?hash="+hash)
	    } catch (err) {
	    	await unconfirmed.deleteUserFromUnconfirmed(hash)
	    	core.sendJSON(response, {errcode: 'RCODE_FAILED_TO_SEND_EMAIL', errmessage: 'Failed to send email'})
	    	return
	    }
	    
	    await users.setCurrentUser(response, args.username)
		core.sendJSON(response, {errcode: null})
	} catch (err) {
		core.sendJSON(response, {errcode: 'RCODE_UNEXPECTED', errmessage: err.toString()})
	}
}