'use strict'

const core = require('../scripts/core')
const users = require('../scripts/users')
const consts = require('../scripts/consts')
const pathModule = require('path')

exports.invoke = async (request, response, data) => {
	const curUser = users.getCurrentUser(request)
	if (!curUser) {
		core.redirect(response, '/auth')
		return
	}
	
	core.sendFullFile(response, pathModule.join(consts.DATA_PATH, 'index.html'))
}