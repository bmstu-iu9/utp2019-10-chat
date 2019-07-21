'use strict'

const jsonfile = require('./jsonfile')
const consts = require('./consts')
const crypto = require('crypto')
const path = require('path')

exports.NEWPASSWORD_PATH = path.join(consts.USERS_PATH, 'newPassword.json')

exports.getHash = async (email) => {
	let newPass = await jsonfile.read(exports.NEWPASSWORD_PATH);
	const hash = crypto.randomBytes(256).toString('hex')

	for (key in newPass) {
		if (newPass[key] == email)
			delete newPass[key]
	}

	newPass[hash] = email
	await jsonfile.write(exports.NEWPASSWORD_PATH, newPass)

	return hash
}

exports.deleteHash = async (hash) => {
	let newPass = await jsonfile.read(exports.NEWPASSWORD_PATH)
	const email = newPass[hash]
	if (!email) {
		return false;
	}
	
	delete newPass[hash]
	await jsonfile.write(exports.NEWPASSWORD_PATH, newPass)
	
	return true
}

exports.isPasswordChanged = async (hash) => {
	let newPass = await jsonfile.read(exports.NEWPASSWORD_PATH)
	const email = newPass[hash]
	if (!email) {
		return false;
	}
	
	delete newPass[hash]
	await jsonfile.write(exports.NEWPASSWORD_PATH, newPass)
	
	return true
}
