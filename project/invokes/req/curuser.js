'use strict'
const core = require('../../scripts/core')
const consts = require('../../scripts/consts')
const users = require('../../scripts/users')
            
exports.invoke = async (request, response) => {
	try {
		core.sendJSON(response, {errcode: null, user: users.getCurrentUser(request)})
	} catch (err) {
		core.sendJSON(response, {errcode: 'RCODE_UNEXPECTED', errmessage: err.toString()})
	}
}