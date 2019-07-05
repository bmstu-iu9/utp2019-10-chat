'use strict'

const core = require('./core')

exports.invoke = (request, response, args) => {
	response.write(args.user)
	if (args.check == "on")
		response.end("<br>ЖОПА")
	else
		response.end("<br>АНДРЕЙ ЛОХ")
} 