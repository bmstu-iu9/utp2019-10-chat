'use strict'

const core = require('../../scripts/core')
const pathModule = require('path')
const users = require('../../scripts/users')
const consts = require('../../scripts/consts')
const crypto = require('crypto')
const jsonfile = require('../../scripts/jsonfile')
const passwordreset = require('../../scripts/passwordreset')

exports.invoke = async (request, response, data) => {
	try {
		let args
		try {
			args = JSON.parse(data)
		} catch (err) {
			core.sendJSON(response, {errcode: 'RCODE_JSON_SYNTAX_ERROR', errmessage: 'JSON syntax error'})
			return
		}

		if (!args.newPassword) {
			core.sendJSON(response, {errcode: 'RCODE_INCORRECT_ARGUMENTS', errmessage: 'Incorrect arguments'})
			return
		}

		let userEmail = await passwordreset.getMailByHash(args.hash)

		if (!userEmail) {
			core.sendJSON(response, {errcode: 'RCODE_INCORRECT_HASH', errmessage: 'Incorrect hash'})
			return
		}

		await passwordreset.setNewPassword(userEmail, args.hash, args.newPassword)

		core.sendJSON(response, {errcode: null})
	} catch (err) {
		core.sendJSON(response, {errcode: 'RCODE_UNEXPECTED', errmessage: err.toString()})
	}
}
