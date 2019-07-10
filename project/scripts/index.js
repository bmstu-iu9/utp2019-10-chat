'use strict'

const core = require('./core')
const users = require('./users')

exports.invoke = async (request, response, data) => {
	const curUser = users.getCurrentUser(request)
	if (!curUser) {
		core.redirect(response, '/auth')
		return
	}
	
	//знаю, что говнокод, но всё равно же он не останется
	let a = ''
	if ((await users.getUserLoginData(await users.getUserMail(curUser))).approveHash) {
		a = ' !!!НЕ ПОДТВЕРЖДЁН!!!<br>'
	}
		
	response.end('<!DOCTYPE html><html><head><title>УРАААА</title></head><body><h1>Вы авторизовались как ' + curUser + a +
			'</h1><button id="exitButton">Выйти</button><br><div id="state"></div>\
			<div id="rcode"></div><script>\
			exitButton.onclick = () => {\
				const req = new XMLHttpRequest();\
				req.open(\'GET\', \'/req/exit.js\', true);\
				req.onreadystatechange = () => {\
					if (req.readyState != 4) return;\
					\
					state.textContent = req.status;\
					rcode.textContent = req.responseText;\
				};\
				req.send(null);\
			};\
			</script></body></html>')
}