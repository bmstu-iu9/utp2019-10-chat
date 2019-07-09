'use strict'
exports.invoke = null

const jsonfile = require('./jsonfile')
const users = require('./users')
const path = require('path')
const consts = require('./consts')
const crypto = require('crypto')

exports.UNCONFIRMED_PATH = path.join(consts.SERVER_PATH, 'unconfirmed.json')

exports.addUserInUnconfirmed = async (email, username, password) => {
	let newConfirmed = await jsonfile.read(exports.UNCONFIRMED_PATH);
	const hash = crypto.randomBytes(256).toString('hex')
	newConfirmed[hash] = email
	await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
	
	try {
		await users.addUser(email, username, password, hash)
	} catch (err) {
		delete newConfirmed[hash]
		await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
		throw err
	}
	
	return hash
}

exports.deleteUserFromUnconfirmed = async (hash) => {
	let newConfirmed = await jsonfile.read(exports.UNCONFIRMED_PATH)
	const email = newConfirmed[hash]
	if (!email) {
		return false;
	}
	
	delete newConfirmed[hash]
	await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
	
	try {
		await users.deleteUser(email)
	} catch (err) {
		newConfirmed[hash] = email
		await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
		throw err
	}
	
	return true
}

exports.approveUnconfirmedUser = async (hash) => {
	let newConfirmed = await jsonfile.read(exports.UNCONFIRMED_PATH)
	const email = newConfirmed[hash]
	if (!email) {
		return false;
	}
	
	delete newConfirmed[hash]
	await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
	
	try {
		await users.approveUser(email)
	} catch (err) {
		newConfirmed[hash] = email
		await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
		throw err
	}
	
	return true
}