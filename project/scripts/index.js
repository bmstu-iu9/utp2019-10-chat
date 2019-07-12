'use strict'

const core = require('./core')
const users = require('./users')
const consts = require('./consts')
const pathModule = require('path')

exports.invoke = async (request, response, data) => {
	const curUser = users.getCurrentUser(request)
	if (!curUser) {
		core.redirect(response, '/auth')
		return
	}
	
	core.sendFullFile(response, pathModule.join(consts.DATA_PATH, 'index.html'))
}