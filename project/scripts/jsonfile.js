'use strict'

const fs = require('fs')

exports.rm = (filename) => {
	return new Promise((resolve, reject) => {
		fs.unlink(pathModule.join(consts.DIALOGS_PATH, id + '.json'), (err) => {
			if (err)
				reject(err)
			else
				resolve()
		})
	})
}

exports.read = (filename) => {
	return new Promise((resolve, reject) => {
		fs.readFile(filename, 'utf-8', (err, objects) => {
			if (err) {
	            reject(err)
	            return
	        }
	        
	        resolve(JSON.parse(objects))
		})
	})
}

exports.write = (filename, data) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(filename, JSON.stringify(data), 'utf8', (errWriteFile) => {
			if (errWriteFile) {
				reject(errWriteFile)
				return
			}
			resolve()
		})
	})
}