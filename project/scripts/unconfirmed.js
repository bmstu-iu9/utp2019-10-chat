'use strict'

const jsonfile = require('./jsonfile')
const users = require('./users')
const path = require('path')
const consts = require('./consts')

exports.UNCONFIRMED_PATH = path.join(consts.USERS_PATH, 'unconfirmed.json')

exports.addUser = (user) => {
	let newConfirmed = await jsonfile.read(exports.UNCONFIRMED_PATH);
	const hash = crypto.randomBytes(256).toString('hex')
	newConfirmed[hash] = username
	await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
	return hash
}

exports.deleteUser = (hash) => {
	let newConfirmed = await jsonfile.read(exports.UNCONFIRMED_PATH)
	const username = newConfirmed[hash]
	
	delete newConfirmed[hash]
	await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
	return username
}

exports.addUserInHash = (user, hash) => {
	let newConfirmed = await jsonfile.read(exports.UNCONFIRMED_PATH);
	newConfirmed[hash] = username
	await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
	return hash
}

/*
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
		await users.deleteUser(username)
	} catch (err) {
		newConfirmed[hash] = username
		await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
		throw err
	}
	
	return true
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
}*/