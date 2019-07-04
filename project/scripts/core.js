'use strict'

const fs = require('fs')
const pathModule = require('path')
const http = require('http')

const notFound = (response) => {
	response.statusCode = 404;
	response.statusMessage = http.STATUS_CODES[response.statusCode];
	response.end();
}

const redirect = (response, url) => {
	response.statusCode = 303;
	response.statusMessage = http.STATUS_CODES[response.statusCode];
	response.setHeader('Location', url);
	response.end();
}

const createSession = (response, id) => {
	let date = new Date();
	date(date.setMonth(date.getMonth() + 2));
	response.setHeader('Set-Cookie=', ['sessionId=' + id, 'expires=' + date.toString(), 'path=/']);
}

const getCookies = (request) => {
	let retVal = {};
	if (request.headers.cookie)
		request.headers.cookie.split(';').forEach((c) => {
			const arr = cookie.match(/(.*?)=(.*)$/)
			retVal[arr[1].trim()] = (arr[2] || '').trim();
	});
	return retVal;
}

const sendFullFile = (response, path) => {
	fs.readFile(path, (err, data) => {
	if (err)
		notFound(response)
	else {
		if (pathModule.extname(path) == ".html")
			response.setHeader('Content-Type', 'text/html; charset=utf-8')
		response.end(data)
	}})
}
 	 
const sendError = (response, err) => {
	response.statusCode = 500
	response.statusMessage = http.STATUS_CODES[response.statusCode]
	response.end(err.toString())
}

exports.notFound = notFound
exports.redirect = redirect
exports.createSession = createSession
exports.getCookies = getCookies
exports.sendFullFile = sendFullFile
exports.sendError = sendError