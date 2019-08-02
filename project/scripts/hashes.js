'use strict'

const jsonfile = require('./jsonfile')
const consts = require('./consts')
const pathModule = require('path')

exports.USERHASHES_PATH = pathModule.join(consts.USERS_PATH, 'hashes.json')

exports.setHash = async (user, name, hash) => {
	let hashes = await jsonfile.read(exports.USERHASHES_PATH)
	hashes[user][name] = hash
	await jsonfile.write(exports.USERHASHES_PATH, hashes)
}

exports.getHash = async (user, name) => {
	hashes = await jsonfile.read(exports.USERHASHES_PATH)
	return hashes[user][name]
}

exports.getHashes = async (user) => {
	hashes = await jsonfile.read(exports.USERHASHES_PATH)
	return hashes[user]
}