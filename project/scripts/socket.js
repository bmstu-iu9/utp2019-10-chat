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
			sockets[socketId].emit('exit')
			sockets[socketId].disconnect(true)
		}
	}
}

exports.exitByUser = (user) => {
	const sockets = exports.io.to('user ' + user).emit('exit').connected
	for (let socketId in sockets)
		sockets[socketId].disconnect(true)
}

exports.deleteUserFromAllDialogs = async (curUser, dialogss) => {
	for (let i = 0; i < dialogss.length; i++) {
		const a = await dialogs.deleteUserDialogOnly(curUser, dialogss[i])
		if (a.deleting) {
			await sendInfoMessage(dialogss[i], curUser + ' удалил чат')
			if (a.brigadier == null)	
				await sendInfoMessage(dialogss[i], 'Бригадир удалил чат, дальнейшая отправка сообщений запрещена')
		}
	}
}

const sendInfoMessage = async (dialogId, msg) => {
	const date = new Date()
	const users = await dialogs.addMessage(dialogId, '', msg, date)
	
	users.forEach((u) => {
		exports.io.to('user ' + u).emit('message', {dialogId: dialogId,
			name: '', message: msg, date: date})
	})
} 

exports.init = () => {
	exports.io = new SocketioServer(server.server)
	
	exports.io.on('connection', async (socket) => {
		const curUser = sessions.getUser(core.getCookies(socket.request).sessionId)
		if (!curUser) {
			socket.emit('err', {errcode: 'RCODE_CONNECT_USER_NOT_FOUND', event: 'connect',
				errmessage: 'Connect user not found'});
			socket.disconnect(true)
			return
		}
	
		if ((await users.getUserAccept(curUser)).notApproved) {
			socket.emit('err', {errcode: 'RCODE_CONNECT_USER_NOT_APPROVED', event: 'connect',
				errmessage: 'Connect user not approved'});
			socket.disconnect(true)
			return
		}
			
		socket.emit('cur', {name: curUser})
	
		socket.join('user ' + curUser, () => {
			socket.on('dialog', async (data) => {
				try {
					const a = await dialogs.addDialog(data.name, curUser, data.users)
					a.users.forEach((u) => {
						exports.io.to('user ' + u).emit('dialog', {name: data.name, id: a.id})
					})
					await sendInfoMessage(a.id, curUser + ' создал чат ' + data.name)
				} catch (err) {
					socket.emit('err', {errmessage: err.toString(), event: 'dialog', data: data,
						errcode: err instanceof dialogs.DialogError ? err.code : 'RCODE_UNEXPECTED'})
				}
			})
			
			socket.on('dialogs', async (data) => {
				try {
					const dlgs = await dialogs.getUserDialogs(curUser, data.begin, data.end)
					socket.emit('dialogs', {dialogs: dlgs})
				} catch (err) {
					socket.emit('err', {errmessage: err.toString(), event: 'dialogs', data: data,
						errcode: err instanceof dialogs.DialogError ? err.code : 'RCODE_UNEXPECTED',
						users: err.code == 'RCODE_USERS_NOT_EXISTS' ? err.users : undefined})
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
					socket.emit('err', {errmessage: err.toString(), event: 'message', data: data,
						errcode: err instanceof dialogs.DialogError ? err.code : 'RCODE_UNEXPECTED'})
				}
			})
			
			socket.on('messages', async (data) => {
				try {
					const a = await dialogs.getMessages(data.dialogId, curUser)
					socket.emit('messages', {dialogId: data.dialogId, messages: a.messages, brigadier: a.brigadier})
				} catch (err) {
					socket.emit('err', {errmessage: err.toString(), event: 'messages', data: data,
						errcode: err instanceof dialogs.DialogError ? err.code : 'RCODE_UNEXPECTED'})
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
					socket.emit('err', {errmessage: err.toString(), event: 'user', data: data,
						errcode: err instanceof dialogs.DialogError ? err.code : 'RCODE_UNEXPECTED'})
				}
			})
			
			socket.on('users', async (data) => {
				try {
					socket.emit('users', await dialogs.getDialogUsers(curUser, data.dialogId))
				} catch (err) {
					socket.emit('err', {errmessage: err.toString(), event: 'users', data: data,
						errcode: err instanceof dialogs.DialogError ? err.code : 'RCODE_UNEXPECTED'})
				}
			})
			
			socket.on('add', async (data) => {
				try {
					await dialogs.addUserInDialog(curUser, data.user, data.dialogId)
					socket.emit('add', {user: data.user})
					await sendInfoMessage(data.dialogId, curUser + ' добавил ' + data.user + ' в чат')
				} catch (err) {
					socket.emit('err', {errmessage: err.toString(), event: 'add', data: data,
						errcode: err instanceof dialogs.DialogError ? err.code : 'RCODE_UNEXPECTED'})
				}
			})
			
			socket.on('delete', async (data) => {
				try {
					const a = await dialogs.userDeleteDialog(curUser, data.dialogId)
					socket.emit('delete', {dialogId: data.dialogId})
					if (a.deleting) {
						await sendInfoMessage(data.dialogId, curUser + ' удалил чат')
						if (a.brigadier == null)
							sendInfoMessage(data.dialogId, 'Бригадир удалил чат, дальнейшая отправка сообщений запрещена')
					}
				} catch (err) {
					socket.emit('err', {errmessage: err.toString(), event: 'delete', data: data,
						errcode: err instanceof dialogs.DialogError ? err.code : 'RCODE_UNEXPECTED'})
				}
			})
			
			socket.on('rm', async (data) => {
				try {
					await dialogs.rmUserFromDialog(curUser, data.user, data.dialogId)
					socket.emit('rm', {user: data.user})
					await sendInfoMessage(data.dialogId, curUser + ' удалил ' + data.user + ' из чата')
				} catch (err) {
					socket.emit('err', {errmessage: err.toString(), event: 'rm', data: data,
						errcode: err instanceof dialogs.DialogError ? err.code : 'RCODE_UNEXPECTED'})
				}
			})
		})
	})
}