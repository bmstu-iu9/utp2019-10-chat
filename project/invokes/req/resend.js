'use strict'

const core = require('../../scripts/core')
const users = require('../../scripts/users')
const unconfirmed = require('../../scripts/unconfirmed')
const changeemail = require('../../scripts/changeemail')
const mail = require('../../scripts/mail')

exports.invoke = async (request, response, data) => {
	try {
		let username

		try {
			username = users.getCurrentUser(request)
		} catch (err) {
			core.sendJSON(response, {errcode: 'RCODE_NOT_AUTHORIZED', errmessage: 'Not authorized'})
			return
		}

		let hash = await unconfirmed.getHashByName(username)

		if (!hash) {
			core.sendJSON(response, {errcode: 'RCODE_ALREADE_CONFIRMED', errmessage: 'Already confirmed'})
			return
		}

		let email = await changeemail.getUserAcceptEmail(username)

		try {
			await mail.sendMail(email, 'QuickChat registration!',
				'Please follow the link below \n\n'+"http://"+request.headers.host+"/approve?hash="+hash)
		} catch (err) {
			core.sendJSON(response, {errcode: 'RCODE_FAILED_TO_SEND_EMAIL', errmessage: 'Failed to send email'})
			return
		}
		core.sendJSON(response, {errcode: null})
	} catch (err) {
		core.sendJSON(response, {errcode: 'RCODE_UNEXPECTED', errmessage: err.toString()})
	}
}
