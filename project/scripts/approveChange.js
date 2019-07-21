'use strict'
const fs = require('fs')
const core = require('../../scripts/core')
const consts = require('../../scripts/consts')
const path = require('path')
const password = require('../../scripts/password')

const approve = async (request, response, data) => {
	let hash
	try {
		hash = core.getQueryParams(data).hash
	} catch (err) {
		core.notFound(response)
	}

	if (!hash) {
		core.redirect(response, '/')
		return
	}

	if (await password.isPasswordChanged(hash)) {
		core.redirect(response, '/')
	} else {
		core.notFound(response)
	}
}

exports.invoke = approve
