'use strict'
const SocketioServer = require('socket.io')
const server = require('./server')
const core = require('./core')
const sessions = require('./sessions')
const dialogs = require('./dialogs')
const users = require('./users')
const consts = require('./consts')

exports.exit = (request) => {
	const sessionId = core.getCookies(request).sessionId
	const curUser = sessions.getUser(sessionId)
	const sockets = exports.io.to('user ' + curUser).connected
	for (let socketId in sockets) {
		if (core.getCookies(sockets[socketId].request).sessionId == sessionId) {
			sockets[socketId].disconnect(true)
		}
	}
}

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
				try {
					const a = await dialogs.addDialog(data.name, curUser, data.users)
					a.users.forEach((u) => {
						exports.io.to('user ' + u).emit('dialog', {name: data.name, id: a.id})
					})
				} catch (err) {
					console.log(err)
					socket.emit('err', {err: err.toString(), event: 'dialog', data: data})
				}
			})
			
			socket.on('dialogs', async (data) => {
				try {
					const dlgs = await dialogs.getUserDialogs(curUser, data.begin, data.end)
					socket.emit('dialogs', {dialogs: dlgs})
				} catch (err) {
					socket.emit('err', {err: err.toString(), event: 'dialogs', data: data})
				}
			})
			
			socket.on('message', async (data) => {
				try {
					const date = new Date()
					const users = await dialogs.addMessage(data.dialogId, curUser, data.message, date)
					
					users.forEach((u) => {
						exports.io.to('user ' + u).emit('message', {dialogId: data.dialogId,
							name: curUser, message: data.message, date: date})
					})
				} catch (err) {
					socket.emit('err', {err: err.toString(), event: 'message', data: data})
				}
			})
			
			socket.on('messages', async (data) => {
				try {
					const messages = await dialogs.getMessages(data.dialogId, curUser)
					socket.emit('messages', {dialogId: data.dialogId, messages: messages})
				} catch (err) {
					socket.emit('err', {err: err.toString(), event: 'messages', data: data})
				}
			})
			
			socket.on('user', async (data) => {
				try {
					const userAccept = await users.getUserAccept(data.name)
					if (!userAccept)
						socket.emit('user', {name: data.name, exists: false})
					else if (userAccept.notApproved)
						socket.emit('user', {name: data.name, exists: false, notApproved: true})
					else
						socket.emit('user', {name: data.name, exists: true})
				} catch (err) {
					socket.emit('err', {err: err.toString(), event: 'user', data: data})
				}
			})
			
			//TODO: dialog user, dialog rm, dialog add
			
			socket.on('users', async (data) => {
				try {
					socket.emit('users', await dialogs.getDialogUsers(curUser, data.dialogId))
				} catch (err) {
					socket.emit('err', {err: err.toString(), event: 'users', data: data})
				}
			})
			
			socket.on('add', async (data) => {
				try {
					await dialogs.addUserInDialog(curUser, data.user, data.dialogId)
					socket.emit('add', {user: data.user})
				} catch (err) {
					socket.emit('err', {err: err.toString(), event: 'add', data: data})
				}
			})
			
			socket.on('delete', async (data) => {
				try {
					await dialogs.userDeleteDialog(curUser, data.dialogId)
					socket.emit('delete', {user: curUser})
				} catch (err) {
					socket.emit('err', {err: err.toString(), event: 'delete', data: data})
				}
			})
			
			socket.on('rm', async (data) => {
				try {
					await dialogs.rmUserFromDialog(curUser, data.user, data.dialogId)
					socket.emit('rm', {user: data.user})
				} catch (err) {
					socket.emit('err', {err: err.toString(), event: 'rm', data: data})
				}
			})
		})
	})
}