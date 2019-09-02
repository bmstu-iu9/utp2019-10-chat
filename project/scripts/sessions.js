'use strict'

const core = require('./core.js')
const consts = require('./consts.js')
const crypto = require('crypto')
const jsonfile = require('./jsonfile')
const fs = require('fs')
const pathModule = require('path')
exports.SESSIONS_PATH = pathModule.join(consts.USERS_PATH, 'sessions.json')

let sessions;
exports.init =  () => {
	sessions = JSON.parse(fs.readFileSync(exports.SESSIONS_PATH))
}

exports.addSession = (username, expires) => {
	return new Promise((resolve, reject) => {
		const sessionIdRec = (errSessionIdRec, buf) => {
			if (errSessionIdRec) {
				reject(errSessionIdRec)
				return
			}

			const sessionId = buf.toString('hex')
			if (sessions[sessionId] !== undefined)
				crypto.randomBytes(16, sessionIdRec)
			else {
				sessions[sessionId] = {username: username, expires: expires.toUTCString()}
				jsonfile.write(exports.SESSIONS_PATH, sessions)
					.then(() => {
						resolve(sessionId)
					}, (errWriteFile) => {
						delete sessions[sessionId]
						reject(errWriteFile)
					})
			}
		}
		
		crypto.randomBytes(16, sessionIdRec)
	})
}

exports.getUser = (sessionId) => {
	if (sessions[sessionId])
		if ((new Date()) < (new Date(sessions[sessionId].expires)))
			return sessions[sessionId].username
		else 
			delete sessions[sessionId]
}

exports.deleteSession = async (sessionId) => {
	const deleteableSession = sessions[sessionId]
	delete sessions[sessionId]
	try {
		await jsonfile.write(exports.SESSIONS_PATH, sessions)
	} catch (errWriteFile) {
		sessions[sessionId] = deleteableSession
		throw errWriteFile
	}
}

exports.clearExpired = async () => {
	const now = new Date()
	for (let sessionId in sessions)
		if (sessions[sessionId].expires <= now)
			delete sessions[sessionId]
	await jsonfile.write(exports.SESSIONS_PATH, sessions)
} 

exports.deleteSessionsByUser = async (user) => {
	for (let sessionId in sessions)
		if (sessions[sessionId].username === user)
			delete sessions[sessionId]
	await jsonfile.write(exports.SESSIONS_PATH, sessions)
}