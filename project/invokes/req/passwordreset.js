'use strict'

const core = require('../../scripts/core')
const users = require('../../scripts/users')
const mail = require('../../scripts/mail')
const passwordreset = require('../../scripts/passwordreset')
            
exports.invoke = async (request, response, data) => {
	try {
		let args
		
		try {
			args = JSON.parse(data)
		} catch (err) {
			core.sendJSON(response, {errcode: 'RCODE_JSON_SYNTAX_ERROR', errmessage: 'JSON syntax error'})
			return
		}
		
		if (!args.email) {
			core.sendJSON(response, {errcode: 'RCODE_INCORRECT_ARGUMENT', errmessage: 'Incorrect argument'})
			return
		}

		if (!(await users.getUserLogin(args.email))) {
			core.sendJSON(response, {errcode: 'RCODE_INCORRECT_EMAIL', errmessage: 'Incorrect email'})
			return
		}

		const hash = await passwordreset.addUserInResetList(args.email)

		try {
			await mail.sendMail(args.email, 'Password reset!',
				'Please follow the link below \n\n'+"http://"+request.headers.host+"/approvereset?hash="+hash)
		} catch (err) {
			await passwordreset.deleteUserFromResetList(hash)
			core.sendJSON(response, {errcode: 'RCODE_FAILED_TO_SEND_EMAIL', errmessage: 'Failed to send email'})
			return
		}

		core.sendJSON(response, {errcode: null})
	} catch (err) {
		core.sendJSON(response, {errcode: err.code, errmessage: err.message})
	}
}
