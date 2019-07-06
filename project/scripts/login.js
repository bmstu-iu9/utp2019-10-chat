'use strict'

const core = require('./core')
const users = require('./users')

exports.invoke = (request, response, data) => {
	const curUser = users.getCurrentUser(request)
	if (curUser) {
		core.redirect(response, '/')
		return
	}

	const args = core.getQueryParams(data)
	if (!args.email || !args.password) {
		core.redirect(response, '/auth')
		return
	}
	
	users.comparePasswords(args.password, args.email)
		.then((is) => {
			if (is) {
				users.setCurrentUser(response, args.email)
					.then(() => {core.redirect(response, '/')},
							(err) => {core.sendError(err)})
			} else
				core.redirect(response, '/auth')
		}, (err) => {
			core.sendError(err)
		})
}