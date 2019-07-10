'use strict'

const core = require('../core')
const users = require('../users')
const consts = require('../consts')
const rcodes = require(consts.RCODES_PATH)

exports.invoke = async (request, response, data) => {
	let args
	
	if (users.getCurrentUser(request)) {
		core.sendJSON(response, {err: rcodes.AUTHORIZED_ALREADY})
		return
	}
	
	try {
		args = JSON.parse(data)
	} catch (err) {
		core.sendJSON(response, {err: rcodes.JSON_SYNTAX_ERROR})
		return
	}
   
	
	
	if (!args.email || !args.password) {
		core.sendJSON(response, {err: rcodes.JSON_SYNTAX_ERROR})
		return
	}
	
	if (!await users.comparePasswords(args.password, args.email)) {
		core.sendJSON(response, {err: rcodes.LOGIN_OR_PASSWORD_INCORRECT})
		return
	}
	
	await users.setCurrentUser(response, (await users.getUserLoginData(args.email)).name)
	core.sendJSON(response, {err: rcodes.SUCCESS})
}