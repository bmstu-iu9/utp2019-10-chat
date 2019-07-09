'use strict'
const fs = require('fs')
const core = require('./core')
const consts = require('./consts')
const path = require('path')
const unconfirmed = require('./unconfirmed')

const approve = async (request, response, data) => {
	try {
		let hash = core.getQueryParams(data).hash
	} catch (err) {
		core.notFound(response)
	}
	
    if (!hash) {
    	core.redirect(response, '/')
    	return
    }
    
    if (await unconfirmed.deleteUserFromUnconfirmed(hash)) {
    	core.redirect(response, '/')
    } else {
    	core.notFound(response)
    }
}

exports.invoke = approve

