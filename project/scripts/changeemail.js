'use strict'

const jsonfile = require('./jsonfile')
const consts = require('./consts')
const crypto = require('crypto')
const path = require('path')
const users = require('./users')
const passwordreset = require('./passwordreset')

exports.CHANGE_PATH = path.join(consts.USERS_PATH, 'changeemail.json')

exports.addUserInChangeEmailList = async (newEmail, email) => {
	let userlogin = await jsonfile.read(users.USERLOGIN_PATH)
	if (userlogin[newEmail]) {
		return false
	}
	let changelist = await jsonfile.read(exports.CHANGE_PATH);
	const hash = crypto.randomBytes(256).toString('hex')

	for (let key in changelist) {
		if (changelist[key].newEmail == newEmail)
			delete changelist[key]
	}
	changelist[hash] = {}
	changelist[hash].email = email
	changelist[hash].newEmail = newEmail

	await jsonfile.write(exports.CHANGE_PATH, changelist)

	return hash
}

exports.deleteUserFromChangeEmailList = async (hash) => {
	let changelist = await jsonfile.read(exports.CHANGE_PATH);
	delete changelist[hash]
	await jsonfile.write(exports.CHANGE_PATH, changelist)
}

exports.deleteByEmail = async(email) => {
	let changelist = await jsonfile.read(exports.CHANGE_PATH);
	for (let i in changelist)
		if (changelist[i].email === email) {
			delete changelist[hash]
			await jsonfile.write(exports.CHANGE_PATH, changelist)
		}
}

exports.getUserAcceptEmail = async (username) => {
	const useraccept = await jsonfile.read(users.USERACCEPT_PATH)
	return useraccept[username].email
}

exports.changeMail = async (hash) => {
	let changelist = await jsonfile.read(exports.CHANGE_PATH);

	if (!changelist[hash]) {
		return false
	}

	let email = changelist[hash].email
	let newEmail = changelist[hash].newEmail

	if (!email || !newEmail) {
		return false
	}

	let userlogin = await jsonfile.read(users.USERLOGIN_PATH)
	userlogin[newEmail] = {}
	userlogin[newEmail].name = userlogin[email].name
	userlogin[newEmail].salt = userlogin[email].salt
	userlogin[newEmail].passwordHash = userlogin[email].passwordHash
	let username = userlogin[email].name
	delete userlogin[email]
	await jsonfile.write(users.USERLOGIN_PATH, userlogin)

	let useraccept = await jsonfile.read(users.USERACCEPT_PATH)
	useraccept[username].email = newEmail
	await jsonfile.write(users.USERACCEPT_PATH, useraccept)

	let resetlist = await jsonfile.read(passwordreset.RESET_PATH);
	for (let key in resetlist) {
		if (resetlist[key] == email)
			delete resetlist[key]
	}
	await jsonfile.write(passwordreset.RESET_PATH, resetlist)

	await exports.deleteUserFromChangeEmailList(hash)
	return true
}

