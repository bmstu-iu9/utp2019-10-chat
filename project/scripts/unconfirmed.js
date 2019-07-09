'use strict'
exports.invoke = null

const jsonfile = require('./jsonfile')
const users = require('./users')

const exports.UNCONFIRMED_PATH = path.join(consts.SERVER_PATH, 'unconfirmed.json')

const exports.addUserInUnconfirmed = async (email, username, password) => {
	let newConfirmed = await jsonfile.read(exports.UNCONFIRMED_PATH)
	const hash = crypto.randomBytes(256).toString('hex')
	newConfirmed[hash] = email
	await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
	
	try {
		await users.addUser(email, username, password)
	} catch (err) {
		delete newConfirmed[hash]
		await jsonfile.write(exports.UNCONFIRMED_PATH, newConfirmed)
		throw
	}
	
	return hash
}

exports.deleteUserFromUnconfirmed = (hash) => {
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
		throw
	}
	
	return true
}