'use strict'

const socketio = require('socket.io')
const server = require('./server')
const core = require('./scripts/core')
const sessions = require('./scripts/sessions')

const io = socketio(server.server)

io.on('connection', (socket) => {
	const user = (sessions.getUser(core.getCookies(socket.request).sessionId)).username
	socket.on('message', (data) => {
		socket.broadcast.emit('message', {user: user, message: data.message})
	})
})