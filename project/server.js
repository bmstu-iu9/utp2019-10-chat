const fs = require('fs')
const pathModule = require('path')
const consts = require('./scripts/consts')
const core = require('./scripts/core')
const http = require('http')
const urlModule = require('url')
const querystring = require('querystring')

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
		let fullPath = pathModule.resolve(routPath, pathModule.relative('/', urlPath))
		isDir(fullPath)
			.then((dirFlag) => {
				return dirFlag && isDir(fullPath = pathModule.resolve(fullPath, indexName))
			}).then((dirFlag) => {
				if (dirFlag)
					reject()
				else
					resolve(fullPath)
			}, (err) => {
				reject(err)
			})
	})
}

const parseArguments = (urlObject) => {
	return querystring.parse(urlObject.query)
}

const requestHandler = (request, response) => {
	if (request.method == "GET"){
		const urlObject = urlModule.parse(request.url)
	
		route(consts.SCRIPTS_PATH, urlObject.pathname, 'index.js')
			.then((path) => {
				require(path).invoke(request, response, parseArguments(urlObject))
			}, (err) => {
				route(consts.DATA_PATH, urlObject.pathname, 'index.html')
					.then((path) => {
						core.sendFullFile(response, path);
					}, (err) => {
						core.notFound(response)
					})
			}).catch((err) => {
			core.sendError(response, err)
		})} else {
			response.statusCode = 501
			response.statusMessage = http.STATUS_CODES[response.statusCode]
			response.setHeader('Allow', 'GET')
			response.end()
		}
}

const server = http.createServer(requestHandler)
server.listen(consts.PORT, (err) => {
    if (err) {
        console.log(err)
    }
    console.log(`server is listening on ${consts.PORT}`)
})