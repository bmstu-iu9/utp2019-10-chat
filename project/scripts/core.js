'use strict'

const fs = require('fs')
const path = require('path')
const http = require('http')
const querystring = require('querystring')

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


exports.notFound = notFound
exports.redirect = redirect
exports.createSession = createSession
exports.getCookies = getCookies
