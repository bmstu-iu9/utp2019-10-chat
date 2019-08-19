'use strict'

const core = require('../../scripts/core')
const users = require('../../scripts/users')
const mail = require('../../scripts/mail')
const changeemail = require('../../scripts/changeemail')


exports.invoke = async (request, response, data) => {
	try {
		let args
		
		try {
			args = JSON.parse(data)
		} catch (err) {
			core.sendJSON(response, {errcode: 'RCODE_JSON_SYNTAX_ERROR', errmessage: 'JSON syntax error'})
			return
		}
		
		if (!args.newEmail || !args.password ||
				typeof(args.newEmail) != 'string' || typeof(args.password) != 'string') {
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

		const hash = await changeemail.addUserInChangeEmailList(args.newEmail, email)
		if (hash) {
			try {
				await mail.sendMail(args.newEmail, 'QuickChat password change!',
					'Please follow the link below \n\n'+"http://"+request.headers.host+"/approvechange?hash="+hash)
			} catch (err) {
				await changeemail.deleteUserFromChangeEmailList(hash)
				core.sendJSON(response, {errcode: 'RCODE_FAILED_TO_SEND_EMAIL', errmessage: 'Failed to send email'})
				return
			}
		} else {
			core.sendJSON(response, {errcode: 'RCODE_EMAIL_ALREADY_EXISTS', errmessage: 'Email already exists'})
		}
		core.sendJSON(response, {errcode: null})

	} catch (err) {
		core.sendJSON(response, {errcode: 'RCODE_UNEXPECTED', errmessage: err.toString()})
	}
}
