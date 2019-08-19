'use strict'
const core = require('../../scripts/core')
const changeemail = require('../../scripts/changeemail')

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

	if (await changeemail.changeMail(hash)) {
		core.sendJSON(response, {errcode: null})
	} else {
		core.sendJSON(response, {errcode: 'RCODE_INCORRECT_ARGUMENTS', errmessage: 'Incorrect arguments'})
	}
}
