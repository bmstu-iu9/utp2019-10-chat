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

		socket.on('message', (data) => {
			socket.broadcast.emit('message', {user: user, message: data.message})
		})

		socket.on('dialogListServer', async (data) => {
			const userDialogs = await dialogs.getUserDialogs (user)
			const list = userDialogs.map(async (element) => dialogs.getDialog(element).name)
			socket.emit('dialogListClient',list)
		})
	})
}