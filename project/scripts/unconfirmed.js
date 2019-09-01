'use strict'

const jsonfile = require('./jsonfile')
const users = require('./users')
const path = require('path')
const consts = require('./consts')
const crypto = require('crypto')

exports.UNCONFIRMED_PATH = path.join(consts.USERS_PATH, 'unconfirmed.json')

exports.addUserInUnconfirmed = async (email, username, password) => {
	let newConfirmed = await jsonfile.read(exports.UNCONFIRMED_PATH);
	const hash = crypto.randomBytes(256).toString('hex')
	newConfirmed[hash] = username
	await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
	
	try {
		await users.addUser(email, username, password)
	} catch (err) {
		delete newConfirmed[hash]
		await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
		throw err
	}
	
	return hash
}

exports.deleteUserFromUnconfirmed = async (hash) => {
	let newConfirmed = await jsonfile.read(exports.UNCONFIRMED_PATH)
	const username = newConfirmed[hash]
	if (!username) {
		return false;
	}
	
	delete newConfirmed[hash]
	await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
	
	try {
		await users.deleteUserReg(username)
	} catch (err) {
		newConfirmed[hash] = username
		await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
		throw err
	}
	
	return true
}

exports.deleteByName = async (name) => {
	let newConfirmed = await jsonfile.read(exports.UNCONFIRMED_PATH)
	for (let i in newConfirmed) {
		if (newConfirmed[i] === name) {
			delete newConfirmed[i]
			await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
		}
	}
}

exports.getHashByName = async (name) => {
	let newConfirmed = await jsonfile.read(exports.UNCONFIRMED_PATH)
	for (let hash in newConfirmed) {
		if (newConfirmed[hash] === name) {
			return hash
		}
	}
	return false;
}

exports.approveUnconfirmedUser = async (hash) => {
	let newConfirmed = await jsonfile.read(exports.UNCONFIRMED_PATH)
	const username = newConfirmed[hash]
	if (!username) {
		return false;
	}
	
	delete newConfirmed[hash]
	await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
	
	try {
		await users.approveUser(username)
	} catch (err) {
		newConfirmed[hash] = username
		await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
		throw err
	}
	
	return true
}
