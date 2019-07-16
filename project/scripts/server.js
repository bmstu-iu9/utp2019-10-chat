'use strict'
const fs = require('fs')
const pathModule = require('path')
const consts = require('./consts')
const core = require('./core')
const http = require('http')
const urlModule = require('url')

const isDir = (path) => {
	return new Promise((resolve, reject) => {
		fs.stat(path, (err, stats) => {
			if (err)
				reject(err)
			else
				resolve(stats.isDirectory())
		})
	})
}

const route = async (routPath, urlPath, indexName) => {
	try {
		let fullPath = pathModule.join(routPath,  urlPath)
		if (!await isDir(fullPath))
			return fullPath
		
		fullPath = pathModule.join(fullPath, indexName)
		
		if (!await isDir(fullPath))
			return fullPath
	} catch (err) {
		if (err.code == "ENOENT")
			return null
		throw err
	}
	return null
}

const scriptInvoke = (path, request, response, urlObject) => {
	const script = require(path)
	if (request.method == "POST") {
		let body = '';

		request.on('data', (data) => {
			body += data
		})

		request.on('end', () => {
			script.invoke(request, response, body)
				.catch((err) => {
					core.sendError(response, err)
				})
		})
	} else if (request.method == "GET" || request.method == "HEAD") {
		response.setHeader('Content-Type', 'text/html; charset=utf-8')
		script.invoke(request, response, urlObject.query)
			.catch((err) => {
				core.sendError(response, err)
			})
	}
	 else {
		response.setHeader('Allow', 'GET, HEAD, POST, OPTIONS')
		response.end()
	}
}

const dataInvoke = (path, request, response) => {
	if (request.method == "GET" || request.method == "HEAD")
		core.sendFullFile(response, path)
	else {
		response.setHeader('Allow', 'GET, HEAD, OPTIONS')
		if (request.method == "POST")
			response.statusCode = 405;
		response.statusMessage = http.STATUS_CODES[response.statusCode];
		response.end();
	}
}

const requestHandler = async (request, response) => {
	if (request.method != 'GET' && request.method != 'POST' &&
			request.method != 'HEAD' && request.method != 'OPTIONS') {
		response.statusCode = 501;
		response.statusMessage = http.STATUS_CODES[response.statusCode];
		response.setHeader('Allow', 'GET, HEAD, POST, OPTIONS')
		response.end();
	} else {		
		const urlObject = urlModule.parse(request.url)
	
		let path = await route(consts.INVOKES_PATH, urlObject.pathname, 'index.js')
		if (path) {
			try {
				scriptInvoke(path, request, response, urlObject)
			} catch (err) {
				core.sendError(response, err)
			}
			return
		}
		
		path = await route(consts.DATA_PATH, urlObject.pathname, 'index.html')
		if (path) {
			dataInvoke(path, request, response)
			return
		}
		
		if (urlObject.pathname == '*' && request.method == "OPTIONS")
			response.setHeader('Allow', 'GET, HEAD, POST, OPTIONS')
		else
			core.notFound(response)
	}
}

exports.init = () => {
	exports.server = http.createServer(requestHandler)
	exports.server.listen(consts.PORT, (err) => {
	    if (err) {
	        console.log(err)
	    }
	    console.log(`server is listening on ${consts.PORT}`)
	})
}