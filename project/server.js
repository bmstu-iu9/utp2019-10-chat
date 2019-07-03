'use strict';

const http = require('http');
const url = require('url')
const fs = require('fs')
const path = require('path')
const core = require('./scripts/core')
const querystring = require('querystring')
const port = 80;

//тестовая версия на убой

const requestHandler = (request, response) => {
	const urlObject = url.parse(request.url);
	
	if (request.method == 'GET') {
		const pth1 = path.resolve(__dirname, "scripts", path.relative("/", urlObject.pathname));
		fs.stat(pth1, (err1, stats1) => {
		
			//если не скрипт
			if (err1 || stats1.isDirectory()) {
				let pth2 = path.resolve(__dirname, path.relative("/", urlObject.pathname));
				fs.stat(pth2, (err2, stats2) => {
					//если его вообще нет
					if (err2) {
						core.notFound(response);
					}
					else {
						//если папка то читаем index.html
						if (stats2.isDirectory()) {
							pth2 = path.resolve(pth2, "index.html")
							response.setHeader('Content-Type', 'text/html; charset=utf-8');
						}
						
						fs.readFile(pth2, (err3, data3) => {
							if (err3)
								core.notFound(response);
							else {
								if (path.extname == "html")
									response.setHeader('Content-Type', 'text/html; charset=utf-8');
								response.write(data3);
							}
							response.end();
						});
					}
				});
			} else {
				//проверяем можно ли такой скрипт читать, если нет, то 404 
				try {
					require(pth1)(request, response, querystring.parse(urlObject.query));
				} catch (e) {
					core.notFound(response);
				}
			}
		});
	}
}

const server = http.createServer(requestHandler)
server.listen(port, (err) => {
    console.log(`server is listening on ${port}`)
})