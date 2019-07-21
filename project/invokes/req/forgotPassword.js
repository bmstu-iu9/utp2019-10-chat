'use strict'
const fs = require('fs')
const core = require('../../scripts/core')
const consts = require('../../scripts/consts')
const path = require('path')
const crypto = require('crypto')
const users = require('../../scripts/users')
const mail = require('../../scripts/mail')
const rcodes = require(consts.RCODES_PATH)

const password = require('../../scripts/password')
            
const forgot = async (request, response, data) => {
	let args
	
	try {
		args = JSON.parse(data)
	} catch (err) {
		core.sendJSON(response, {err: rcodes.JSON_SYNTAX_ERROR})
		return
	}
	
	if (!args.email) {
		core.sendJSON(response, {err: rcodes.JSON_SYNTAX_ERROR})
		return
	}

	if (!(await users.getUserLogin(args.email))) {
		core.sendJSON(response, {err: rcodes.EMAIL_INCORRECT})
		return
	}

	const hash = await password.getHash(args.email)

	try {
		await mail.sendMail(args.email, 'Change Password!',
			'Please follow the link below \n\n'+"http://"+request.headers.host+"???"+hash)
	} catch (err) {
		await password.deleteHash(hash)
		core.sendJSON(response, {err: rcodes.FAILED_TO_SEND_EMAIL})
		return
	}

	core.sendJSON(response, {err: rcodes.SUCCESS})
}

exports.invoke = forgot
