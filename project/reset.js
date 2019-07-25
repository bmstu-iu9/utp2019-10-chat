'use strict'

const dialogs = require('./scripts/dialogs')
const consts = require('./scripts/consts')
const users = require('./scripts/users')
const unconfirmed = require('./scripts/unconfirmed')
const sessions = require('./scripts/sessions')
const fs = require('fs')
const pathModule = require('path')

const resetDir = (dirPath) => {
	try {
		const stat = fs.statSync(dirPath)
		dirOrFileDelete(dirPath)
		fs.mkdirSync(dirPath)
	} catch (err) {
		if (err.code == 'ENOENT')
			fs.mkdirSync(dirPath)
		else
			throw err
	}
}

const resetJSON = (filePath) => {
	fs.writeFileSync(filePath, JSON.stringify({}))
}

const dirOrFileDelete = (path) => {
	const stat = fs.statSync(path)
	if (stat.isDirectory()) {
		fs.readdirSync(path).forEach((f) => {
			dirOrFileDelete(pathModule.join(path, f))
		})
		fs.rmdirSync(path)
	}
	
	if (stat.isFile()) {
		fs.unlinkSync(path)
	}
}

resetDir(consts.USERS_PATH)
resetDir(consts.DIALOGS_PATH)
resetJSON(users.USERLOGIN_PATH)
resetJSON(users.USERACCEPT_PATH)
resetJSON(unconfirmed.UNCONFIRMED_PATH)
fs.writeFileSync(dialogs.USERDIALOGS_PATH, JSON.stringify({length: 0}))
resetJSON(sessions.SESSIONS_PATH)