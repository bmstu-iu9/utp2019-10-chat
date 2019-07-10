'use strict'

const core = require('../core')
const users = require('../users')
const consts = require('../consts')
const rcodes = require(consts.RCODES_PATH)

exports.invoke = async (request, response, data) => {
	if (!users.getCurrentUser(request)) {
		core.sendJSON(response, {err: rcodes.NOT_AUTHORIZED})
		return
	}
	
	await users.deleteCurrentUser(request, response)
	core.sendJSON(response, {err: rcodes.SUCCESS})
}	