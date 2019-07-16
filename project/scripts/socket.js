'use strict'
const SocketioServer = require('socket.io')
const server = require('./server')
const core = require('./core')
const sessions = require('./sessions')
const dialogs = require('./dialogs')

let activeUsers = {}

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
				socket.emit('dialogs', {ids: getUserDialogs(curUser, data.begin, data.end)})
			})
		})
	})
}