'use strict'

const core = require('../../scripts/core')
const users = require('../../scripts/users')
const consts = require('../../scripts/consts')
const pathModule = require('path')

exports.invoke = async (request, response, data) => {
	const curUser = users.getCurrentUser(request)
	if (!curUser) {
		core.sendFullFile(response, pathModule.join(consts.HTML_PATH, 'tmp/auth.html'))
		return
	}
	
	core.sendFullFile(response, pathModule.join(consts.HTML_PATH, 'tmp/chat.html'))
}