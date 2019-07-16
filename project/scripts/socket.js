'use strict'
const SocketioServer = require('socket.io')
const server = require('./server')
const core = require('./core')
const sessions = require('./sessions')
const dialogs = require('./dialogs')

exports.init = () => {
	exports.io = new SocketioServer(server.server)
	
	exports.io.on('connection', (socket) => {
		const curUser = sessions.getUser(core.getCookies(socket.request).sessionId)
		socket.join('user ' + curUser, () => {
			socket.on('dialog', (data) => {
				dialogs.addDialog(data.name, data.users)
					.then((id) => {
						data.users.forEach((u) => {
							exports.io.to('user ' + u).emit('dialog', {name: data.name, id: id})
						})
					})
			})
			
			socket.on('dialogs', (data) => {
				dialogs.getUserDialogs(curUser)
					.then((ids) => {
						socket.emit('dialogs', {ids: ids})
					})
			})
			
			socket.on('message', (data) => {
				const date = (new Date()).toUTCString()
				dialogs.addMessage(data.dialogId, curUser, data.message, date)
					.then(() => {						
						return dialogs.getDialogUsers(data.dialogId)
					}).then((users) => {
						users.forEach((u) => {
							exports.io.to('user ' + u).emit('message', {dialogId: data.dialogId,
								name: curUser, message: data.message, date: date})
						})
					})
			})
			
			socket.on('messages', (data) => {
				
				dialogs.getMessages(data.dialogId)
					.then((messages) => {
						socket.emit('messages', {dialogId: data.dialogId, messages: messages})
						console.log({dialogId: data.dialogId, messages: messages})
					})
			})
		})
	})
}