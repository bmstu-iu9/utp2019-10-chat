'use strict'
const core = require('../../scripts/core')
const pathModule = require('path')
const users = require('../../scripts/users')
const consts = require('../../scripts/consts')

exports.invoke = async (request, response, data) => {
	const curUser = users.getCurrentUser(request)
	if (curUser) {
		if ((await users.getUserAccept(curUser)).notApproved) {
			core.redirect(response, '/profile')
			return
		}
		
		core.redirect(response, '/')
		return
	}
	
	core.sendFullFile(response, pathModule.join(consts.DATA_PATH, 'auth/index.html'))
}