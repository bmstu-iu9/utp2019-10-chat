'use strict'

const core = require('../../scripts/core')
const users = require('../../scripts/users')
const consts = require('../../scripts/consts')
const socket = require('../../scripts/socket.js')

exports.invoke = async (request, response, data) => {
	try {
		if (!users.getCurrentUser(request)) {
			core.sendJSON(response, {errcode: 'RCODE_NOT_AUTHORIZED', errmessage: 'Not authorized'})
			return
		}
		
		socket.exit(request)
		await users.deleteCurrentUser(request, response)
		core.sendJSON(response, {errcode: null})
	} catch (err) {
		core.sendJSON(response, {errcode: 'RCODE_UNEXPECTED', errmessage: err.toString()})
	}
}	