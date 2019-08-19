'use strict'

const core = require('./core')
const sessions = require('./sessions')
const consts = require('./consts')
const jsonfile = require('./jsonfile')
const pathModule = require('path')
const crypto = require('crypto')
const unconfirmed = require('./unconfirmed')
const passwordreset = require('./passwordreset')
const changeemail = require('./changeemail')
const socket = require('./socket')


exports.USERLOGIN_PATH = pathModule.join(consts.USERS_PATH, 'login.json')
exports.USERACCEPT_PATH = pathModule.join(consts.USERS_PATH, 'accept.json')
exports.SALT_LENGTH = 16
exports.PASSWORD_ITERATIONS_COUNT = 1000
exports.PASSWORD_HASH_LENGTH = 32

exports.passwordHash = (password, salt) => {
	return new Promise((resolve, reject) => {
		crypto.pbkdf2(password, salt,
			exports.PASSWORD_ITERATIONS_COUNT, exports.PASSWORD_HASH_LENGTH, 'sha1',
			(err, derivedKey) => {
				if (err) {
					reject(errPbkdf2)
				} else {
					resolve(derivedKey.toString('hex'))
				}
			})
	})
}

exports.addUser = async (email, name, password) => {
	let userlogin = await jsonfile.read(exports.USERLOGIN_PATH)
	let useraccept = await jsonfile.read(exports.USERACCEPT_PATH)
	
	useraccept[name] = {}
	useraccept[name].email = email
	userlogin[email] = {}
	userlogin[email].name = name
	userlogin[email].salt = crypto.randomBytes(16).toString('hex')
	useraccept[name].notApproved = true
	userlogin[email].passwordHash = await exports.passwordHash(password, userlogin[email].salt)
	
	await jsonfile.write(exports.USERACCEPT_PATH, useraccept)
	try {
		await jsonfile.write(exports.USERLOGIN_PATH, userlogin)
	} catch (err) {
		delete useraccept[name]
		await jsonfile.write(exports.USERACCEPT_PATH, useraccept)
		throw err
	}
}

exports.approveUser = async (name) => {
	let useraccept = await jsonfile.read(exports.USERACCEPT_PATH)
	delete useraccept[name].notApproved
	useraccept[name].dialogs = []
	await jsonfile.write(exports.USERACCEPT_PATH, useraccept)
}

exports.getUserLogin = async (email) => {
	const userlogin = await jsonfile.read(exports.USERLOGIN_PATH)
	return userlogin[email]
}

exports.getUserAccept = async (username) => {
	const useraccept = await jsonfile.read(exports.USERACCEPT_PATH)
	return useraccept[username]
}

exports.getFullUserAccept = async () => {
	const useraccept = await jsonfile.read(exports.USERACCEPT_PATH)
	return useraccept
}

exports.deleteUserReg = async (username) => {
	let userlogin = await jsonfile.read(exports.USERACCEPT_PATH)
	let useraccept = await jsonfile.read(exports.USERACCEPT_PATH)
	
	const ua = useraccept[username]
	const ul = userlogin[ua.email]
	delete useraccept[username]
	delete userlogin[ua.email]
	
	await jsonfile.write(exports.USERACCEPT_PATH, useraccept)
	try {
		await jsonfile.write(exports.USERLOGIN_PATH, userlogin)
	} catch (err) {
		useraccept[username] = ua
		await jsonfile.write(exports.USERACCEPT_PATH, useraccept)
		throw err
	}
}

exports.deleteUser = async (username) => {
	let userlogin = await jsonfile.read(exports.USERACCEPT_PATH)
	let useraccept = await jsonfile.read(exports.USERACCEPT_PATH)
	
	const ua = useraccept[username]
	const ul = userlogin[ua.email]
	delete useraccept[username]
	delete userlogin[ua.email]
	
	await jsonfile.write(exports.USERACCEPT_PATH, useraccept)
	try {
		await jsonfile.write(exports.USERLOGIN_PATH, userlogin)
	} catch (err) {
		useraccept[username] = ua
		await jsonfile.write(exports.USERACCEPT_PATH, useraccept)
		throw err
	}

	//Дальше не будем проверять по причине того, что удаление уже прекрасно совершилось
	try {
		await unconfirmed.deleteByName(username)
		await passwordreset.deleteByEmail(ua.email)
		await changeemail.deleteByEmail(ua.email)
		if (ua.dialogs)
			await socket.deleteUserFromAllDialogs(username, ua.dialogs)
		await socket.exitByUser(username)
		await sessions.deleteSessionsByUser(username)
	} catch (err) {
		err.rcode = 'RCODE_USER_DELETE_NOT_ALL'
		throw err
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

exports.comparePasswords = async (password, email) => {
	let userlogin = await jsonfile.read(exports.USERLOGIN_PATH)
	if (userlogin[email] === undefined)
		return false
		
	return await exports.passwordHash(password, userlogin[email].salt) == userlogin[email].passwordHash
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
