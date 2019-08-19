'use strict'

const jsonfile = require('./jsonfile')
const consts = require('./consts')
const crypto = require('crypto')
const path = require('path')
const users = require('./users')

exports.RESET_PATH = path.join(consts.USERS_PATH, 'resetlist.json')

exports.addUserInResetList = async (email) => {
	let resetlist = await jsonfile.read(exports.RESET_PATH);
	const hash = crypto.randomBytes(256).toString('hex')

	for (let key in resetlist) {
		if (resetlist[key] == email)
			delete resetlist[key]
	}

	resetlist[hash] = email
	await jsonfile.write(exports.RESET_PATH, resetlist)

	return hash
}

exports.deleteUserFromResetList = async (hash) => {
	let resetlist = await jsonfile.read(exports.RESET_PATH)
	const email = resetlist[hash]
	if (!email) {
		return false;
	}
	
	delete resetlist[hash]
	await jsonfile.write(exports.RESET_PATH, resetlist)
	
	return true
}

exports.deleteByEmail = async (email) => {
	let resetlist = await jsonfile.read(exports.RESET_PATH)
	for (let i in newConfirmed) {
		if (resetlist[i] === email) {
			delete resetlist[i]
			await jsonfile.write(exports.RESET_PATH, resetlist)
			return
		}
	}
}

exports.getMailByHash = async (hash) => {
	const resetlist = await jsonfile.read(exports.RESET_PATH)
	return resetlist[hash]
}

exports.setNewPassword = async (email, hash, newPassword) => {
	let userlogin = await jsonfile.read(users.USERLOGIN_PATH);

	userlogin[email].salt = crypto.randomBytes(16).toString('hex')
	userlogin[email].passwordHash = await users.passwordHash(newPassword, userlogin[email].salt)

	await jsonfile.write(users.USERLOGIN_PATH, userlogin)
	await exports.deleteUserFromResetList(hash)
}

