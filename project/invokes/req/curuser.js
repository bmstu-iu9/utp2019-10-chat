'use strict'
const core = require('../../scripts/core')
const consts = require('../../scripts/consts')
const users = require('../../scripts/users')
            
exports.invoke = async (request, response) => {
	try {
		const curUser = users.getCurrentUser(request)
		const ua = await users.getUserAccept(curUser)
		core.sendJSON(response, {errcode: null, user: curUser,
			notapproved: ua ? ua.notApproved : undefined})
	} catch (err) {
		core.jsonError(response, err)
	}
}
