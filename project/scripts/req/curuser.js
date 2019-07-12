'use strict'
const core = require('../core')
const consts = require('../consts')
const users = require('../users')
const rcodes = require(consts.RCODES_PATH)
            
exports.invoke = async (request, response, data) => {
	core.sendJSON(response, {user: users.getCurrentUser(request)})
}