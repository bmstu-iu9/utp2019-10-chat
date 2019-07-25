'use strict'

const core = require('./core')
const sessions = require('./sessions')
const consts = require('./consts')
const jsonfile = require('./jsonfile')
const pathModule = require('path')
const crypto = require('crypto')
const socket = require('./socket')

exports.USERDATA_PATH = pathModule.join(consts.USERS_PATH, 'data.json')

'use strict'

const jsonfile = require('./jsonfile')
const consts = require('./consts')
const pathModule = require('path')

exports.USERDATA_PATH = pathModule.join(consts.USERS_PATH, 'data.json')

let userdata;
exports.init =  () => {
	userdata = JSON.parse(fs.readFileSync(exports.USERDATA_PATH))
}

exports.addUser = async (user) => {
	userdata[user] = {dialogs: []}
	await jsonfile.write(exports.USERDATA_PATH, userdata)
}

exports.deleteDialog = async (user, dialogId) => {
	const i = userdata[user].dialogs.indexOf(dialogId)
	if (i < 0)
		return
	userdata[user].dialogs.splice(i, 1)
	await jsonfile.write(exports.USERDATA_PATH, userdata)
}

exports.deleteUser = async (user) => {
	const dialogs = userdata[user].dialogs
	delete userdata[user]
	await jsonfile.write(exports.USERDATA_PATH, userdata)
	return dialogs
}

exports.getDialogs = (user) => {
	return userdata[user].dialogs
}