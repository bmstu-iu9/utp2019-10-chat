'use strict'
const SocketioServer = require('socket.io')
const server = require('./server')
const core = require('./core')
const sessions = require('./sessions')
const dialogs = require('./dialogs')
const users = require('./users')
const consts = require('./consts')
const rcodes = require(consts.RCODES_PATH)

exports.init = () => {
	exports.io = new SocketioServer(server.server)
	
	exports.io.on('connection', async (socket) => {
		const curUser = sessions.getUser(core.getCookies(socket.request).sessionId)
		if (!curUser || (await users.getUserAccept(curUser)).notApproved) {
			socket.disconnect(true)
			return
		}
			
		socket.join('user ' + curUser, () => {
			socket.on('dialog', async (data) => {
				const userAccept = await users.getFullUserAccept()
				let notExistsUsers = []
				data.users.forEach((u) => {
					if (u != '' && (!userAccept[u] || userAccept[u].notApproved))
						notExistsUsers.push(u)
				})
				
				if (notExistsUsers.length) {
					socket.emit('error', {err: rcodes.DIALOG_USERNAMES_INCORRECT, users: notExistsUsers})
					return
				}
				
				data.users.push(curUser)
				const id = await dialogs.addDialog(data.name, data.users)
				
				data.users.forEach((u) => {
					exports.io.to('user ' + u).emit('dialog', {name: data.name, id: id})
				})
			})
			
			socket.on('dialogs', (data) => {
				dialogs.getUserDialogs(curUser, data.begin, data.end)
					.then((dlgs) => {
						socket.emit('dialogs', {dialogs: dlgs})
					})
			})
			
			socket.on('message', async (data) => {
				const date = (new Date()).toUTCString()
				if (!await dialogs.addMessage(data.dialogId, curUser, data.message, date)) {
					socket.emit('err', {err: rcodes.DIALOG_FORBIDDEN, dialogId: data.dialogId})
					return
				}
				
				
				const users = await dialogs.getDialogUsers(data.dialogId)
				users.forEach((u) => {
					exports.io.to('user ' + u).emit('message', {dialogId: data.dialogId,
						name: curUser, message: data.message, date: date})
				})
			})
			
			socket.on('messages', async (data) => {
				const messages = await dialogs.getMessages(data.dialogId, curUser)
				
				if (!messages) {
					socket.emit('err', {err: rcodes.DIALOG_FORBIDDEN, dialogId: data.dialogId})
					return
				}
				socket.emit('messages', {dialogId: data.dialogId, messages: messages})
			})
		})
	})
}