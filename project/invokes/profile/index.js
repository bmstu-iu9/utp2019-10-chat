'use strict'
const core = require('../../scripts/core')
const pathModule = require('path')
const users = require('../../scripts/users')
const consts = require('../../scripts/consts')

exports.invoke = async (request, response, data) => {
	const curUser = users.getCurrentUser(request)
	
	if (!curUser) {
		core.redirect(response, '/auth')
		return
	}

	core.sendFullFile(response, pathModule.join(consts.DATA_PATH, 'profile/index.html'))
}