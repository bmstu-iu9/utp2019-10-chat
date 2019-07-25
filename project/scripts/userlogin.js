'use strict'

const core = require('./core')
const consts = require('./consts')
const jsonfile = require('./jsonfile')
const pathModule = require('path')
const crypto = require('crypto')

exports.USERLOGIN_PATH = pathModule.join(consts.USERS_PATH, 'login.json')

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
	
	userlogin[email] = {}
	userlogin[email].name = name
	userlogin[email].salt = crypto.randomBytes(16).toString('hex')
	userlogin[email].passwordHash = await exports.passwordHash(password, userlogin[email].salt)
	
	await jsonfile.write(exports.USERLOGIN_PATH, userlogin)
}

exports.getUser = async (email) => {
	const userlogin = await jsonfile.read(exports.USERLOGIN_PATH)
	return userlogin[email]
}

exports.deleteUser = async (email) => {
	let userlogin = await jsonfile.read(exports.USERACCEPT_PATH)
	
	delete userlogin[email]
	
	await jsonfile.write(exports.USERLOGIN_PATH, userlogin)
}

exports.changeUserEmail = async (what, where) => {
	let userlogin = await jsonfile.read(exports.USERACCEPT_PATH)
	
	if (userlogin[where])
		return false

	userlogin[where] = userlogin[what]
	delete userlogin[what]
	return true
}

exports.comparePasswords = async (password, email) => {
	let userlogin = await jsonfile.read(exports.USERLOGIN_PATH)
	if (!userlogin[email])
		return false
		
	return (await exports.passwordHash(password, userlogin[email].salt)) == userlogin[email].passwordHash
}