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
		
		await users.deleteCurrentUser(request, response)
		try {
			await users.deleteUser(curUser)
		} catch (err) {
			if (err.rcode) {
				console.log(err)
				core.sendJSON(response, {errcode: err.rcode, errmessage: err.toString()})
				return
			}
			else
				throw err
		}
		core.sendJSON(response, {errcode: null})
	} catch (err) {
		core.sendJSON(response, {errcode: 'RCODE_UNEXPECTED', errmessage: err.toString()})
	}
}	