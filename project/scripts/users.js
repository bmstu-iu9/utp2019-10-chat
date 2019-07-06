'use strict'
exports.invoke = null

const core = require('./core')
const sessions = require('./sessions')
const consts = require('./consts')
const fs = require('fs')
const pathModule = require('path')
const crypto = require('crypto')

exports.USERS_PATH = pathModule.join(consts.SERVER_PATH, 'users.json')
exports.SALT_LENGTH = 16
exports.PASSWORD_ITERATIONS_COUNT = 1000
exports.PASSWORD_HASH_LENGTH = 32

let users;
exports.init = () => {
	users = JSON.parse(fs.readFileSync(exports.USERS_PATH))
}

exports.addUser = (email, name, password) => {
	return new Promise((resolve, reject) => {
		users[email] = {}
		users[email].name = name
		users[email].salt = crypto.randomBytes(16).toString('hex')
		crypto.pbkdf2(password, users[email].salt,
				exports.PASSWORD_ITERATIONS_COUNT, exports.PASSWORD_HASH_LENGTH, 'sha1',
				(errPbkdf2, derivedKey) => {
					if (errPbkdf2) {
						delete users[email]
						reject(errPbkdf2)
					} else {
						users[email].passwordHash = derivedKey.toString('hex')
						fs.writeFile(exports.USERS_PATH, JSON.stringify(users), 'utf8', (errWriteFile) => {
							if (errWriteFile) {
								delete users[email]
								reject(errWriteFile)
							} else
								resolve()
						})
					}
				})
	})
}

exports.getUser = (email) => {
	return users[email]
}

exports.deleteUser = (email) => {
	return new Promise((resolve, reject) => {
		const deleteableUser = users[email]
		delete users[email]
		fs.writeFile(exports.USERS_PATH, JSON.stringify(users), 'utf8', (errWriteFile) => {
			if (errWriteFile) {
				users[email] = deleteableUser
				reject(errWriteFile)
			} else
				resolve()
		})
	})
}

exports.getCurrentUser = (request) => {
	const cookies = core.getCookies(request)
	console.log(cookies)
	if (cookies !== undefined && cookies.sessionId !== undefined) {
		const session = sessions.getUser(cookies.sessionId)
		if (session !== undefined && (new Date()) < (new Date(session.expires)))
			return users[session.email]
	}
}

exports.comparePasswords = (password, email) => {
	return new Promise((resolve, reject) => {
		if (users[email] === undefined)
			resolve(false)
		else {
			crypto.pbkdf2(password, users[email].salt,
					exports.PASSWORD_ITERATIONS_COUNT, exports.PASSWORD_HASH_LENGTH, 'sha1',
					(errPbkdf2, derivedKey) => {
						if (errPbkdf2)
							reject(errPbkdf2)
						else
							resolve(derivedKey.toString('hex') === users[email].passwordHash)
			})
		}
	})
}

exports.setCurrentUser = (response, email) => {
	return new Promise((resolve, reject) => {
		let expires = new Date()
		expires.setMonth(expires.getMonth() + 2)
		sessions.addSession(email, expires)
		.then((sessionId) => {
			core.createSession(response, sessionId, expires)
			resolve()
		}, (err) => {
			reject(err)
		})
	})
}