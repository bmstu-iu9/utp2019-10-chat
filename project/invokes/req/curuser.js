'use strict'
const core = require('../../scripts/core')
const consts = require('../../scripts/consts')
const users = require('../../scripts/users')
            
exports.invoke = async (request, response) => {
	try {
		core.sendJSON(response, {errcode: null, user: users.getCurrentUser(request),
			notapproved: (await users.getUserAccept(curUser)).notApproved})
	} catch (err) {
		core.sendJSON(response, {errcode: 'RCODE_UNEXPECTED', errmessage: err.toString()})
	}
}