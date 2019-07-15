'use strict'
const socketio = require('socket.io')
const server = require('./server')
const core = require('./core')
const sessions = require('./sessions')



//версия на убой

exports.init = () => {
	exports.io = socketio(server.server)
	
	exports.io.on('connection', (socket) => {
		const user = sessions.getUser(core.getCookies(socket.request).sessionId)
		console.log('connect')
		socket.on('message', (data) => {
			socket.broadcast.emit('message', {user: user, message: data.message})
		})
		socket.on('disconnect', (data) => {
			console.log('disconnect')
		})
	})
}