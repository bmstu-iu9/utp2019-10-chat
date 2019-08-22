'use strict'

const core = require('../../scripts/core')
const users = require('../../scripts/users')
const changeemail = require('../../scripts/changeemail')
const jsonfile = require('../../scripts/jsonfile')
const crypto = require('crypto')

exports.invoke = async (request, response, data) => {
	try {
		let args
		
		try {
			args = JSON.parse(data)
		} catch (err) {
			core.sendJSON(response, {errcode: 'RCODE_JSON_SYNTAX_ERROR', errmessage: 'JSON syntax error'})
			return
		}

		if (!args.password || !args.newPassword ||
				typeof(args.password) != 'string' || typeof(args.newPassword) != 'string') {
			core.sendJSON(response, {errcode: 'RCODE_INCORRECT_ARGUMENTS', errmessage: 'Incorrect arguments'})
			return
		}

		let username

		try {
			username = users.getCurrentUser(request)
		} catch (err) {
			core.sendJSON(response, {errcode: 'RCODE_NOT_AUTHORIZED', errmessage: 'Not authorized'})
			return
		}

		let email = await changeemail.getUserAcceptEmail(username)
		if (!await users.comparePasswords(args.password, email)) {
			core.sendJSON(response, {errcode: 'RCODE_LOGIN_OR_PASSWORD_INCORRECT', errmessage: 'Login or password incorrect'})
			return
		}

		let userlogin = await jsonfile.read(users.USERLOGIN_PATH)
		userlogin[email].salt = crypto.randomBytes(16).toString('hex')
		userlogin[email].passwordHash = await users.passwordHash(args.newPassword, userlogin[email].salt)
		await jsonfile.write(users.USERLOGIN_PATH, userlogin)
		
		core.sendJSON(response, {errcode: null})

	} catch (err) {
		core.sendJSON(response, {errcode: 'RCODE_UNEXPECTED', errmessage: err.toString()})
	}
}
