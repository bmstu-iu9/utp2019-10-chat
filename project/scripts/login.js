'use strict'

const core = require('./core')

exports.invoke = (request, response, args) => {
	response.setHeader('Content-Type', 'text/html;charset=utf-8')
	response.write(args.user)
	if (args.check == "on")
		response.end("<br>ЖОПА")
	else
		response.end("<br>АНДРЕЙ ЛОХ")
	
} 