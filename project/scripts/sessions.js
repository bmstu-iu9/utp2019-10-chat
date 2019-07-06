'use strict'
exports.invoke = null

const core = require('./core.js')
const consts = require('./consts.js')
const crypto = require('crypto')
const fs = require('fs');
const pathModule = require('path')
exports.SESSIONS_PATH = pathModule.join(consts.SERVER_PATH, 'sessions.json')

let sessions;
exports.init = () => {
	sessions = JSON.parse(fs.readFileSync(exports.SESSIONS_PATH))
}

exports.addSession = (email, expires) => {
	return new Promise((resolve, reject) => {
		const sessionIdRec = (errSessionIdRec, buf) => {
			if (errSessionIdRec)
				reject(errSessionIdRec)

				const sessionId = buf.toString('hex')
				if (sessions[sessionId] !== undefined)
					crypto.randomBytes(16, sessionIdRec)
				else {
					sessions[sessionId] = {email: email, expires: expires.toUTCString()}
					fs.writeFile(exports.SESSIONS_PATH, JSON.stringify(sessions), 'utf8', (errWriteFile) => {
						if (errWriteFile) {
							delete sessions[sessionId]
							reject(errWriteFile)
						} else
							resolve(sessionId)
					})
				}
			}
		
			crypto.randomBytes(16, sessionIdRec)
	})
}

exports.getUser = (sessionId) => {
	return sessions[sessionId]
}

exports.deleteSession = (sessionId) => {
	return new Promise((resolve, reject) => {
		const deleteableSession = sessions[sessionId]
		delete sessions[sessionId]
		fs.writeFile(exports.SESSIONS_PATH, JSON.stringify(sessions), 'utf8', (errWriteFile) => {
			if (errWriteFile) {
				sessions[sessionId] = deleteableSession
				reject(errWriteFile)
			} else
				resolve()
		})
	})
}