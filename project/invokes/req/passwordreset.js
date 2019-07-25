'use strict'

const core = require('../../scripts/core')
const users = require('../../scripts/users')
const mail = require('../../scripts/mail')
const resetmethods = require('../../scripts/resetmethods')
            
const reset = async (request, response, data) => {
	let args
	
	try {
		args = JSON.parse(data)
	} catch (err) {
		core.sendJSON(response, {errcode: 'RCODE_JSON_SYNTAX_ERROR', errmessage: "data has systax error"})
		return
	}
	
	if (!args.email) {
		core.sendJSON(response, {errcode: 'RCODE_JSON_SYNTAX_ERROR', errmessage: "data has systax error"})
		return
	}

	if (!(await users.getUserLogin(args.email))) {
		core.sendJSON(response, {errcode: 'RCODE_JSON_SYNTAX_ERROR', errmessage: "incorrect email"})
		return
	}

	const hash = await resetmethods.getHash(args.email)

	try {
		await mail.sendMail(args.email, 'Password reset!',
			'Please follow the link below \n\n'+"http://"+request.headers.host+"/approvereset?hash="+hash)
	} catch (err) {
		await resetmethods.deleteHash(hash)
		core.sendJSON(response, {errcode: 'RCODE_JSON_SYNTAX_ERROR', errmessage: "can not send email"})
		return
	}

	core.sendJSON(response, {errcode: null})
}

exports.invoke = reset
