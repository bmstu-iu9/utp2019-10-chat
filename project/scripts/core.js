'use strict'
exports.invoke = null

const fs = require('fs')
const pathModule = require('path')
const http = require('http')
const querystring = require('querystring')

exports.notFound = (response) => {
	response.statusCode = 404;
	response.statusMessage = http.STATUS_CODES[response.statusCode];
	response.end();
}

const redirectNote = (response, url) => {
	response.write('<!DOCTYPE html><html><head><title>Redirect</title></head><body><h1>Redirect<br><a href=\"')
	response.write(url)
	response.write('\">');
	response.write(url)
	response.write('</a></h1></body></html>')
}

exports.redirect = (response, url) => {
	response.statusCode = 303;
	response.statusMessage = http.STATUS_CODES[response.statusCode];
	response.setHeader('Location', url);
	redirectNote(response, url)
}

exports.redirectLikewise = (response, url) => {
	response.statusCode = 307;
	response.statusMessage = http.STATUS_CODES[response.statusCode];
	response.setHeader('Location', url);
	redirectNote(response, url)
}

exports.forbidden = (response) => {
	response.statusCode = 403;
	response.statusMessage = http.STATUS_CODES[response.statusCode];
	response.end();
}

exports.createSession = (response, id, date) => {
	response.setHeader('Set-Cookie', 'sessionId=' + id + ';expires=' + date.toUTCString())
}

exports.getCookies = (request) => {
	let retVal = {};
	if (request.headers.cookie)
		request.headers.cookie.split(';').forEach((c) => {
			const arr = c.match(/(.*?)=(.*)$/)
			retVal[arr[1].trim()] = (arr[2] || '').trim();
	});
	return retVal;
}

exports.sendFullFile = (response, path) => {
	fs.readFile(path, (err, data) => {
	if (err)
		exports.notFound(response)
	else {
		if (pathModule.extname(path) == ".html")
			response.setHeader('Content-Type', 'text/html; charset=utf-8')
		response.end(data)
	}})
}
 	 
exports.sendError = (response, err) => {
	response.statusCode = 500
	response.statusMessage = http.STATUS_CODES[response.statusCode]
	response.write('<!DOCTYPE html><html><head><title>500</title></head><body><h1>500 ')
	response.write(response.statusMessage)
	response.write('</h1>')
	response.write(err.toString() + '<br>' + err.fileName + '<br>' + err.lineNumber)
	response.end('</body></html>')
}

exports.getQueryParams = (data) => {
	return querystring.parse(data)
}