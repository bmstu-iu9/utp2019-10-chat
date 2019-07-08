'use strict'

const core = require('./core')
const users = require('./users')

exports.invoke = (request, response, data) => {
	const curUser = users.getCurrentUser(request)
	if (!curUser) {
		core.redirect(response, '/auth')
		return
	}
	core.redirect(response, "/authsuccess.html")
}