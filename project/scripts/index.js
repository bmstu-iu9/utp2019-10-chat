'use strict'

const core = require('./core')
const users = require('./users')

exports.invoke = (request, response, data) => {
	const curUser = users.getCurrentUser(request)
	if (!curUser) {
		core.redirect(response, '/auth')
		return
	}
	response.end('<!DOCTYPE html><html><head><title>Че нибудь написано</title></head><body><h1>Вы авторизовались как ' + curUser.name +
			'</h1><form action="/sessionsExit.js">'+
			'<button>Чтобы выйти нажми сюда</button>' +
			'</form>'+
			'</body>'+
			'</html>')
}