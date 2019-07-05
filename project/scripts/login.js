'use strict'

const core = require('./core')

exports.invoke = (request, response, data) => {
	const args = core.getQueryParams(data)
	response.write(args.user)
	if (args.check == "on")
		response.end("<br>ЖОПА")
	else
		response.end("<br>АНДРЕЙ ЛОХ")
} 