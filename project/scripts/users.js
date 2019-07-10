'use strict'
exports.invoke = null

const core = require('./core')
const sessions = require('./sessions')
const consts = require('./consts')
const jsonfile = require('./jsonfile')
const pathModule = require('path')
const crypto = require('crypto')

exports.USERLOGIN_PATH = pathModule.join(consts.SERVER_PATH, 'userlogin.json')
exports.USERMAIL_PATH = pathModule.join(consts.SERVER_PATH, 'usermail.json')
exports.SALT_LENGTH = 16
exports.PASSWORD_ITERATIONS_COUNT = 1000
exports.PASSWORD_HASH_LENGTH = 32

const passwordHash = (password, salt) => {
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

exports.addUser = async (email, name, password, approveHash) => {
	let userlogin = await jsonfile.read(exports.USERLOGIN_PATH)
	let usermail = await jsonfile.read(exports.USERMAIL_PATH)
	
	usermail[name] = email
	userlogin[email] = {}
	userlogin[email].name = name
	userlogin[email].salt = crypto.randomBytes(16).toString('hex')
	userlogin[email].approveHash = approveHash
	userlogin[email].passwordHash = await passwordHash(password, userlogin[email].salt)
	
	await jsonfile.write(exports.USERMAIL_PATH, usermail)
	try {
		await jsonfile.write(exports.USERLOGIN_PATH, userlogin)
	} catch (err) {
		delete usermail[name]
		await jsonfile.write(exports.USERMAIL_PATH, usermail)
		throw err
	}
}

exports.approveUser = async (email) => {
	let userlogin = await jsonfile.read(exports.USERLOGIN_PATH)
	delete userlogin[email].approveHash
	await jsonfile.write(exports.USERLOGIN_PATH, userlogin)
}

exports.getUserLoginData = async (email) => {
	const userlogin = await jsonfile.read(exports.USERLOGIN_PATH)
	return userlogin[email]
}

exports.getUserMail = async (username) => {
	const usermail = await jsonfile.read(exports.USERMAIL_PATH)
	return usermail[username]
}

exports.deleteUser = async (email) => {
	let userlogin = await jsonfile.read(exports.USERLOGIN_PATH)
	let usermail = await jsonfile.read(exports.USERMAIL_PATH)
	
	const username = userlogin[email].name
	delete usermail[username]
	delete userlogin[email]
	
	await jsonfile.write(exports.USERMAIL_PATH, usermail)
	try {
		await jsonfile.write(exports.USERLOGIN_PATH, userlogin)
	} catch (err) {
		usermail[username] = email
		await jsonfile.write(exports.USERMAIL_PATH, usermail)
		throw err
	}
}

exports.getCurrentUser = (request) => {
	const cookies = core.getCookies(request)
	console.log(cookies)
	if (cookies !== undefined && cookies.sessionId !== undefined) {
		const session = sessions.getUser(cookies.sessionId)
		if (session !== undefined && (new Date()) < (new Date(session.expires)))
			return session.username
	}
}

exports.comparePasswords = async (password, email) => {
	let userlogin = await jsonfile.read(exports.USERLOGIN_PATH)
	if (userlogin[email] === undefined)
		return false
		
	return await passwordHash(password, userlogin[email].salt) == userlogin[email].passwordHash
}

exports.setCurrentUser = async (response, username) => {
	let expires = new Date()
	expires.setMonth(expires.getMonth() + 2)
	const sessionId = await sessions.addSession(username, expires)
	core.createSession(response, sessionId, expires)
}

exports.deleteCurrentUser = async (request, response) => {
	const sessionId = exports.getCurrentUser(request)
	core.createSession(response, sessionId, new Date())
	await sessions.deleteSession(sessionId)
}