'use strict'
const socketio = require('socket.io')
const server = require('./server')
const core = require('./core')
const sessions = require('./sessions')
const dialogs = require('./dialogs')


//версия на убой

exports.init = () => {
	exports.io = socketio(server.server)
	
	exports.io.on('connection', (socket) => {
		const user = sessions.getUser(core.getCookies(socket.request).sessionId)

		socket.on('message', async (data) => {
			await dialogs.addMessage(data.idDialog,user,data.message)
			const messages = await dialogs.getMessages(data.idDialog,20)
			socket.emit('message', {message: messages})
		})

		socket.on('dialogListServer', async (data) => {
			const userDialogs = await dialogs.getUserDialogs (user)
			const list = userDialogs.map(async (element) => await dialogs.getDialog(element).name)
			socket.emit('dialogListClient',list)
		})
	})
}