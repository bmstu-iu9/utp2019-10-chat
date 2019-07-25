'use strict'

const core = require('./core')
const sessions = require('./sessions')
const consts = require('./consts')
const jsonfile = require('./jsonfile')
const pathModule = require('path')
const userlogin = require('./userlogin')
const useraccept = require('./useraccept')
const userdata = require('./userdata')
const unconfirmed = require('./unconfirmed')

exports.addUser = async (email, name, password) => {
	await userlogin.addUser(email, name, password)
	try {
		const hash = await unconfirmed.addUser(name)
		try {
			await useraccept.setUser({email: email, approve: hash})
		} catch (err) {
			await unconfirmed.deleteUser(name)
			throw err
		}
	} catch (err) {
		await userligin.deleteUser(email)
		throw err
	}
}

exports.approveUser = async (hash) => {
	const user = await unconfirmed.deleteUser()
	try {
		await userdata.addUser(user)
		try {
			await useraccept.setField(user, 'approve')
		} catch (err) {
			await userdata.deleteUser(user)
		}
	} catch (err) {
		await unconfirmed.addUserInHash(user, hash)
	}
}

exports.deleteUser = async (user) => {
	const accept = await useraccept.getUser(user)
	await useraccept.setUser(user, undefined)
	try {
		await userlogin.deleteUser(accept.email)
		try {
			await unconfirmed.deleteUser(user)
			try {
				const dialogs = await userdata.deleteUser(user)
				try {
					await socket.deleteUser(user)
					try {
						await sessions.deleteUserSessions(user)
					}
				}
			}
		}
	}
}

exports.getCurrentUser = (request) => {
	const cookies = core.getCookies(request)
	if (cookies !== undefined && cookies.sessionId !== undefined) {
		const username = sessions.getUser(cookies.sessionId)
		if (username !== undefined)
			return username
	}
}

exports.setCurrentUser = async (response, username) => {
	let expires = new Date()
	expires.setMonth(expires.getMonth() + 2)
	const sessionId = await sessions.addSession(username, expires)
	core.sendSessionId(response, sessionId, expires)
}

exports.deleteCurrentUser = async (request, response) => {
	const sessionId = exports.getCurrentUser(request)
	core.sendSessionId(response, sessionId, new Date())
	await sessions.deleteSession(sessionId)
}