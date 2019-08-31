'use strict'

const core = require('../../scripts/core')
const users = require('../../scripts/users')
const mail = require('../../scripts/mail')
const passwordreset = require('../../scripts/passwordreset')
const changeemail = require('../../scripts/changeemail')

exports.invoke = async (request, response, data) => {
	try {
		let username

		try {
			username = users.getCurrentUser(request)
		} catch (err) {
			core.sendJSON(response, {errcode: 'RCODE_NOT_AUTHORIZED', errmessage: 'Not authorized'})
			return
		}

		let email = await changeemail.getUserAcceptEmail(username)
		const hash = await passwordreset.addUserInResetList(email)

		try {
			await mail.sendMail(email, 'Password reset!',
				'Please follow the link below \n\n'+"http://"+request.headers.host+"/approvereset?hash="+hash)
		} catch (err) {
			console.log(err)
			await passwordreset.deleteUserFromResetList(hash)
			core.sendJSON(response, {errcode: 'RCODE_FAILED_TO_SEND_EMAIL', errmessage: 'Failed to send email'})
			return
		}

		core.sendJSON(response, {errcode: null})
	} catch (err) {
		core.sendJSON(response, {errcode: 'RCODE_UNEXPECTED', errmessage: err.toString()})
	}
}
