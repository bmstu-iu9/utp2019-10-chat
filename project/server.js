const fs = require('fs')
const pathModule = require('path')
const consts = require('./scripts/consts')
const core = require('./scripts/core')
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

const route = (routPath, urlPath, indexName) => {
	return new Promise((resolve, reject) => {
		let fullPath = pathModule.join(routPath,  urlPath)
		isDir(fullPath)
			.then((dirFlag) => {
				return dirFlag && isDir(fullPath = pathModule.join(fullPath, indexName))
			}).then((dirFlag) => {
				if (dirFlag)
					reject(new Error('index is folder, path: ' + fullPath))
				else
					resolve(fullPath)
			}, (err) => {
				reject(err)
			}).catch((err) => {
				err.message = 'Routing error, caused by ' + err.message
				core.sendError(err)
			})
	})
}

const scriptInvoke = (path, request, response, urlObject) => {
	const script = require(path)
	if (script.invoke === null)
		core.forbidden(response)
	else if (request.method == "POST") {
		let body = '';

		request.on('data', (data) => {
			body += data
		})

		request.on('end', () => {
			response.setHeader('Content-Type', 'text/html; charset=utf-8')
			script.invoke(request, response, body)
		})
	} else if (request.method == "GET" || request.method == "HEAD") {
		response.setHeader('Content-Type', 'text/html; charset=utf-8')
		script.invoke(request, response, urlObject.query)
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

const requestHandler = (request, response) => {
	if (request.method != 'GET' && request.method != 'POST' &&
			request.method != 'HEAD' && request.method != 'OPTIONS') {
		response.statusCode = 501;
		response.statusMessage = http.STATUS_CODES[response.statusCode];
		response.setHeader('Allow', 'GET, HEAD, POST, OPTIONS')
		response.end();
	} else {		
		const urlObject = urlModule.parse(request.url)
	
		route(consts.SCRIPTS_PATH, urlObject.pathname, 'index.js')
			.then((path) => {
				scriptInvoke(path, request, response, urlObject)
			}, (err) => {
				route(consts.DATA_PATH, urlObject.pathname, 'index.html')
					.then((path) => {
						dataInvoke(path, request, response)
					}, (err) => {
						if (urlObject.pathname == '*' && request.method == "OPTIONS")
							response.setHeader('Allow', 'GET, HEAD, POST, OPTIONS')
						else
							core.notFound(response)
					})
			}).catch((err) => {
				core.sendError(response, err)
			})
	}
}

const server = http.createServer(requestHandler)
server.listen(consts.PORT, (err) => {
    if (err) {
        console.log(err)
    }
    console.log(`server is listening on ${consts.PORT}`)
})