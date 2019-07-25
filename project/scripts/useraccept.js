'use strict'

const jsonfile = require('./jsonfile')
const consts = require('./consts')
const pathModule = require('path')

exports.USERACCEPT_PATH = pathModule.join(consts.USERS_PATH, 'accept.json')

exports.setField = async (user, name, field) => {
	let accept = await jsonfile.read(exports.USERACCEPT_PATH)
	fieldes[user][name] = field
	await jsonfile.write(exports.USERACCEPT_PATH, accept)
}

exports.getField = async (user, name) => {
	accept = await jsonfile.read(exports.USERACCEPT_PATH)
	return accept[user][name]
}

exports.getUser = async (user) => {
	accept = await jsonfile.read(exports.USERACCEPT_PATH)
	return accept[user]
}

exports.setUser = async (user, data) => {
	let accept = await jsonfile.read(exports.USERACCEPT_PATH)
	fieldes[user] = data
	await jsonfile.write(exports.USERACCEPT_PATH, accept)
}