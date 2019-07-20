'use strict'
const core = require('../../scripts/core')
const consts = require('../../scripts/consts')
const users = require('../../scripts/users')
const rcodes = require(consts.RCODES_PATH)
const dialogs = require('../../scripts/dialogs')
            
exports.invoke = async (request, response, data) => {
	core.sendJSON(response, {dialogs : dialogs.getUserDialogs(users.getCurrentUser(request))})
}