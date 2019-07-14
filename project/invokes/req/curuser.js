'use strict'
const core = require('../../scripts/core')
const consts = require('../../scripts/consts')
const users = require('../../scripts/users')
const rcodes = require(consts.RCODES_PATH)
            
exports.invoke = async (request, response, data) => {
	core.sendJSON(response, {user: users.getCurrentUser(request)})
}