'use strict'
const core = require('../../scripts/core')
const users = require('../../scripts/users')
const consts = require('../../scripts/consts')

exports.invoke = async (request, response, data) => {
	try {
		let args
		
		if (users.getCurrentUser(request)) {
			core.sendJSON(response, {errcode: 'RCODE_AUTHORIZED_ALREADY', errmessage: 'Authorized already'})
			return
		}
		
		try {
			args = JSON.parse(data)
		} catch (err) {
			core.sendJSON(response, {errcode: 'RCODE_JSON_SYNTAX_ERROR', errmessage: 'JSON syntax error'})
			return
		}
	   
		
		
		if (!args.email || !args.password || typeof(args.email) != 'string' || typeof(args.password) != 'string') {
			core.sendJSON(response, {errcode: 'RCODE_INCORRECT_ARGUMENTS', errmessage: 'Incorrect arguments'})
			return
		}
		
		if (!await users.comparePasswords(args.password, args.email)) {
			core.sendJSON(response, {errcode: 'RCODE_LOGIN_OR_PASSWORD_INCORRECT', errmessage: 'Login or password incorrect'})
			return
		}
		
		await users.setCurrentUser(response, (await users.getUserLogin(args.email)).name)
		core.sendJSON(response, {errcode: null})
	} catch (err) {
		core.sendJSON(response, {errcode: 'RCODE_UNEXPECTED', errmessage: err.toString()})
	}
}