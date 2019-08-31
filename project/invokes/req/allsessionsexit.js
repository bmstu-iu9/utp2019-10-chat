'use strict'

const core = require('../../scripts/core')
const sessions = require('../../scripts/sessions')
const users = require('../../scripts/users')
const consts = require('../../scripts/consts')
const socket = require('../../scripts/socket.js')

exports.invoke = async (request, response, data) => {
	try {
		const curUser = users.getCurrentUser(request)
		if (!curUser) {
			core.sendJSON(response, {errcode: 'RCODE_NOT_AUTHORIZED', errmessage: 'Not authorized'})
			return
		}
		
		socket.exitByUser(curUser)
		await sessions.deleteSessionsByUser(curUser)
		await users.deleteCurrentUser(request, response)
		core.sendJSON(response, {errcode: null})
	} catch (err) {
		core.sendJSON(response, {errcode: 'RCODE_UNEXPECTED', errmessage: err.toString()})
	}
}	