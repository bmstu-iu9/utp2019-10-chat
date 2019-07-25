'use strict'
const core = require('../../scripts/core')
const pathModule = require('path')
const users = require('../../scripts/users')
const consts = require('../../scripts/consts')
const crypto = require('crypto')
const resetmethods = require('../../scripts/resetmethods')

exports.USERLOGIN_PATH = pathModule.join(consts.USERS_PATH, 'login.json')
exports.USERACCEPT_PATH = pathModule.join(consts.USERS_PATH, 'accept.json')

exports.setPassword = async (request, response, data) => {
	let args
	
	try {
		args = JSON.parse(data)
	} catch (err) {
		core.sendJSON(response, {errcode: 'RCODE_JSON_SYNTAX_ERROR', errmessage: "data has systax error"})
		return
	}
	
	if (!args.newPassword) {
		core.sendJSON(response, {errcode: 'RCODE_JSON_SYNTAX_ERROR', errmessage: "input is empty"})
		return
	}

	let userEmail = resetmethods.getMail(args.hash)

	if (!userEmail) {
		core.sendJSON(response, {errcode: 'RCODE_JSON_SYNTAX_ERROR', errmessage: "systax error"})
		return
	}

	let USERLOGIN = await jsonfile.read(exports.USERLOGIN_PATH);

	USERLOGIN[userEmail].salt = crypto.randomBytes(16).toString('hex')
	USERLOGIN[userEmail].passwordHash = await users.passwordHash(args.newPassword, USERLOGIN[userEmail].salt)

	await jsonfile.write(exports.USERLOGIN_PATH, USERLOGIN)
	await resetmethods.deleteHash(hash)

	core.redirect(response, '/')
}

exports.invoke = setPassword
