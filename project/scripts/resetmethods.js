'use strict'

const jsonfile = require('./jsonfile')
const consts = require('./consts')
const crypto = require('crypto')
const path = require('path')

exports.RESET_PATH = path.join(consts.USERS_PATH, 'usersforreset.json')

exports.getHash = async (email) => {
	let RESETPATH = await jsonfile.read(exports.RESET_PATH);
	const hash = crypto.randomBytes(256).toString('hex')

	for (let key in RESETPATH) {
		if (RESETPATH[key] == email)
			delete RESETPATH[key]
	}

	RESETPATH[hash] = email
	await jsonfile.write(exports.RESET_PATH, RESETPATH)

	return hash
}

exports.deleteHash = async (hash) => {
	let RESETPATH = await jsonfile.read(exports.RESET_PATH)
	const email = RESETPATH[hash]
	if (!email) {
		return false;
	}
	
	delete RESETPATH[hash]
	await jsonfile.write(exports.RESET_PATH, RESETPATH)
	
	return true
}

exports.getMail = async (hash) => {
	const RESETPATH = await jsonfile.read(exports.RESET_PATH)
	return RESETPATH[hash]
}

