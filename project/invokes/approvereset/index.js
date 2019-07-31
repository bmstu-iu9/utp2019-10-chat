'use strict'
const core = require('../../scripts/core')
const consts = require('../../scripts/consts')
const pathModule = require('path')
const passwordreset = require('../../scripts/passwordreset')

exports.invoke = async (request, response, data) => {
	let hash
	try {
		hash = core.getQueryParams(data).hash
	} catch (err) {
		core.notFound(response)
		return
	}

	if (!hash) {
		core.redirect(response, '/')
		return
	}

	let email = await passwordreset.getMailByHash(hash)

	if (!email) {
		core.notFound(response)
		return
	}

	core.sendFullFile(response, pathModule.join(consts.DATA_PATH, 'reset.html'))
}
