'use strict'

const core = require('../core')
const pathModule = require('path')
const users = require('../users')
const consts = require('../consts')

exports.invoke = async (request, response, data) => {
	const curUser = users.getCurrentUser(request)
	if (curUser) {
		core.redirect(response, '/')
		return
	}
	
	core.sendFullFile(response, pathModule.join(consts.DATA_PATH, 'auth/index.html'))
}